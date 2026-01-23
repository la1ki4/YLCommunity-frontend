import React, { useMemo } from "react";

function isSvgMarkup(value) {
    return typeof value === "string" && value.trim().startsWith("<svg");
}

function ensureCurrentColor(svgText) {
    let out = svgText;
    out = out.replace(
        /<svg\b([^>]*)>/i,
        (m, attrs) => {
            const hasFill = /\bfill\s*=/.test(attrs);
            const hasStroke = /\bstroke\s*=/.test(attrs);
            const fillAttr = hasFill ? "" : ' fill="currentColor"';
            const strokeAttr = hasStroke ? "" : ' stroke="currentColor"';
            return `<svg${attrs}${fillAttr}${strokeAttr}>`;
        }
    );

    out = out.replace(/\bfill="(?!none)[^"]*"/gi, 'fill="currentColor"');
    out = out.replace(/\bstroke="(?!none)[^"]*"/gi, 'stroke="currentColor"');

    return out;
}

export function Media({
                          image,
                          className = "",
                          alt = "",
                          style = {},
                          as: Component = "img",
                          inlineSvg = false,
                          color,
                          ...restProps
                      }) {
    const shouldInline = inlineSvg || isSvgMarkup(image);

    const mergedStyle = useMemo(() => {
        if (shouldInline && color) return { ...style, color };
        return style;
    }, [shouldInline, color, style]);

    if (shouldInline) {
        const svg = typeof image === "string" ? ensureCurrentColor(image) : "";
        return (
            <span
                className={className}
                style={mergedStyle}
                role={alt ? "img" : undefined}
                aria-label={alt || undefined}
                dangerouslySetInnerHTML={{ __html: svg }}
                {...restProps}
            />
        );
    }

    return (
        <Component
            src={image}
            alt={alt}
            className={className}
            style={mergedStyle}
            {...restProps}
        />
    );
}
