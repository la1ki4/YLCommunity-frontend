import {Text} from "@shared/Text/Text.jsx";
import {Block} from "@shared/Block/Block.jsx";
import {InputField} from "@shared/Input/Input.jsx";
import {Button} from "@shared/Button/Button.jsx";
import textStyles from "@app/styles/text.module.css"
import blockFormStyle from "@app/styles/block.module.css"
import inputStyle from "@app/styles/input.module.css"
import {Image} from "@shared/Image/Image.jsx";
import pictureStyle from "@app/styles/picture.module.css"
import NewPostIcon from "@app/assets/New_post.svg"
import postStyles from "@app/styles/post.module.css";

export function CreationPostBlock() {
    return (
        <Block className={`${blockFormStyle.blockContainer} ${blockFormStyle.blockPadding}`}>
            <Block className={blockFormStyle.addNewPostBlockDistance}>
                <Text text={"What's new?"} className={textStyles.bigTitle}></Text>
            </Block>
            <Block className={`${blockFormStyle.blockFile}`}>
                <InputField type={"file"} className={
                    `${inputStyle.inputFileButton}`}>
                </InputField>
                <Image image={NewPostIcon} className={pictureStyle.addNewPostIcon}></Image>
                <Text text={"Add new post"} className={textStyles.addNewPostText}></Text>
            </Block>
            <Block className={`${postStyles.postAddCommentContainer} ${blockFormStyle.addNewPostBlockDistance}`}>
                <InputField type="text" placeholder='Say something new ...' className={postStyles.postAddComment}/>
            </Block>
            <Button onClick={Button} type={"submit"} label={"Add post"}></Button>
        </Block>
    )
}