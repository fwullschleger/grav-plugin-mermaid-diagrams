<?php
namespace Grav\Plugin;

use \Grav\Common\Plugin;
use RocketTheme\Toolbox\Event\Event;

class MermaidDiagramsPlugin extends Plugin
{
    protected $theme;

    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            'onPageContentRaw' => ['onPageContentRaw', 0],
            'onTwigSiteVariables'   => ['onTwigSiteVariables', 0]
        ];
    }

    public function onPageContentRaw(Event $event)
    {
        // Variables
        $this->align = $this->config->get('plugins.mermaid-diagrams.align');

        $page = $event['page'];
        $twig = $this->grav['twig'];
        $config = $this->mergeConfig($page);

        if ($config->get('enabled')) {

            // Get initial content
            $raw = $page->getRawContent();

            $match_mermaid = function ($matches) use (&$page, &$twig, &$config) {
                // Get the matching content
                $search_mermaid = $matches[0];

                // Remove the tab selector
                $search_mermaid = str_replace("[mermaid]", "", $search_mermaid);
                $search_mermaid = str_replace("[/mermaid]", "", $search_mermaid);

                // Creating the replacement structure
                $source_b64 = base64_encode(trim($search_mermaid));
                $replace_header = "<div class=\"mermaid\" style=\"text-align:".$this->align."\" data-source=\"".$source_b64."\">";
                $replace_footer = "</div>";
                $replace_content = $search_mermaid;
                $replace = "$replace_header" . "$replace_content" . "$replace_footer";

                return $replace;
            };

            $raw = $this->parseInjectMermaid($raw, $match_mermaid);

            if ($this->config->get('plugins.mermaid-diagrams.fenced_code_blocks')) {
                $match_mermaid_fenced = function ($matches) {
                    $source_b64 = base64_encode(trim($matches[1]));
                    $replace_header = "<div class=\"mermaid\" style=\"text-align:".$this->align."\" data-source=\"".$source_b64."\">";
                    $replace_footer = "</div>";
                    return $replace_header . $matches[1] . $replace_footer;
                };

                $raw = $this->parseInjectMermaidFenced($raw, $match_mermaid_fenced);
            }

            $page->setRawContent($raw);
        }
    }

    /**
     *  Applies a specific function to the result of the flow's regexp
     */
    protected function parseInjectMermaid($content, $function)
    {
        // Regular Expression for selection
        $regex = '/\[mermaid\]([\s\S]*?)\[\/mermaid\]/';
        return preg_replace_callback($regex, $function, $content);
    }

    protected function parseInjectMermaidFenced($content, $function)
    {
        $regex = '/```mermaid\s*\n?([\s\S]*?)```/';
        return preg_replace_callback($regex, $function, $content);
    }

    /**
     * Set needed ressources to display and convert charts
     */
    public function onTwigSiteVariables()
    {
        // Variables
        $this->theme = $this->config->get('plugins.mermaid-diagrams.theme');
        $this->font_size = $this->config->get('plugins.mermaid-diagrams.font.size');
        $this->font_color = $this->config->get('plugins.mermaid-diagrams.font.color');
        $this->line_color = $this->config->get('plugins.mermaid-diagrams.line.color');
        $this->element_color = $this->config->get('plugins.mermaid-diagrams.line.color');
        $this->condition_yes = $this->config->get('plugins.mermaid-diagrams.condition.yes');
        $this->condition_no = $this->config->get('plugins.mermaid-diagrams.condition.no');
        $this->gantt_axis = $this->config->get('plugins.mermaid-diagrams.gantt.axis');

        // Determine JS asset group (e.g. 'bottom' for Helios, empty for Learn2)
        $jsGroup = $this->config->get('plugins.mermaid-diagrams.js_group');
        $jsOptions = $jsGroup ? ['group' => $jsGroup] : [];

        // Resources for the conversion
        $this->grav['assets']->addJs('plugin://mermaid-diagrams/js/mermaid.min.js', $jsOptions);

        if ($this->config->get('plugins.mermaid-diagrams.lightbox')) {
            $lightboxJsOptions = $jsGroup ? ['group' => $jsGroup, 'loading' => 'defer'] : ['loading' => 'defer'];
            $this->grav['assets']->addJs('plugin://mermaid-diagrams/js/mermaid-lightbox.js', $lightboxJsOptions);
            $this->grav['assets']->addCss('plugin://mermaid-diagrams/css/mermaid-lightbox.css');
        }

        // Disable startOnLoad so we can restore original source from base64 first,
        // since Grav's markdown processor may mangle special characters (e.g. <<interface>>)
        $init = "mermaid.initialize({
                    startOnLoad: false,
                    gantt: { axisFormat: \"".$this->gantt_axis."\" }
                 });
                 function __mermaidDecode(b64) {
                    return new TextDecoder().decode(Uint8Array.from(atob(b64), function (c) { return c.charCodeAt(0); }));
                 }
                 function __mermaidRender() {
                    document.querySelectorAll('.mermaid[data-source]').forEach(function(el) {
                        el.textContent = __mermaidDecode(el.dataset.source);
                    });
                    mermaid.run();
                 }
                 document.addEventListener('DOMContentLoaded', __mermaidRender);
                 document.body.addEventListener('htmx:afterSettle', __mermaidRender);";

        $inlineJsOptions = $jsGroup ? ['group' => $jsGroup] : [];
        $this->grav['assets']->addInlineJs($init, $inlineJsOptions);
    }
}
