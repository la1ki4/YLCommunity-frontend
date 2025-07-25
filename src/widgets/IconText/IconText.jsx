import { Image } from '@shared/Image/Image.jsx';
import { Text } from '@shared/Text/Text.jsx';

export function IconText({
    image,
    text,
    imageClass = '',
    textClass = '',
    textClassDirection = '',
    wrapperClass = '',
    as: Component = 'div',
    ...restProps 
}) {
    const renderText = () => {
        if (Array.isArray(text)) {
            const classes = Array.isArray(textClass) ? textClass : [];
            return text.map((t, i) => (
                <Text
                    key={i}
                    text={t}
                    className={classes[i] || ''}
                />
            ));
        }
        return <Text text={text} className={textClass} />;
    };

    return (
        <Component className={wrapperClass} {...restProps}>
            <Image image={image} className={imageClass} />
            <div className={textClassDirection}>
                {renderText()}
            </div>
        </Component>
    );
}