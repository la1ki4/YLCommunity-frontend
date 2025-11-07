import {Text} from "@shared/Text/Text.jsx";
import {Block} from "@shared/Block/Block.jsx";
import {InputField} from "@shared/Input/Input.jsx";
import {Button} from "@shared/Button/Button.jsx";
import textStyles from "@app/styles/text.module.css"
import blockFormStyle from "@app/styles/block.module.css"
import inputStyle from "@app/styles/input.module.css"
import {Image} from "@shared/Image/Image.jsx";
import NewPostIcon from "@app/assets/New_post.svg"

export function CreationPostBlock() {
    return (
        <Block className={`${blockFormStyle.blockContainer} ${blockFormStyle.blockPadding}`}>
            <Text text={"What's new?"} className={textStyles.bigTitle}></Text>
            <Block className={blockFormStyle.blockFile}>
                <InputField type={"file"} className={
                    `${inputStyle.inputFileButton}`}>
                </InputField>
                <Image image={NewPostIcon}></Image>
                <Text text={"Add new post"}></Text>
            </Block>
            <Block>
                <InputField></InputField>
            </Block>
            <Button onClick={Button} type={"submit"} label={"Add post"}></Button>
        </Block>
    )
}