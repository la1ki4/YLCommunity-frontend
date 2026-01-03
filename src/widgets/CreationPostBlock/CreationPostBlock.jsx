import {motion, AnimatePresence} from "framer-motion";
import {Text} from "@shared/Text/Text.jsx";
import {Block} from "@shared/Block/Block.jsx";
import {InputField} from "@shared/Input/Input.jsx";
import {Button} from "@shared/Button/Button.jsx";
import postButtonStyle from "@app/styles/button.module.css"
import textStyles from "@app/styles/text.module.css"
import blockFormStyle from "@app/styles/block.module.css"
import inputStyle from "@app/styles/input.module.css"
import {Media} from "@shared/Image/Media.jsx";
import pictureStyle from "@app/styles/picture.module.css"
import NewPostIcon from "@app/assets/New_post.svg"
import postStyles from "@app/styles/post.module.css";
import fileUploadStyle from "@app/styles/file-upload-block.module.css"
import {useCreatePostFeature} from "@features/add-post-file/createPostFeature.jsx";

export function CreationPostBlock() {
    const {
        fileInputRef,
        fileUrl,
        fileType,
        handleBlockClick,
        handleFileChange,
        handleRemoveFile,
        description,
        setDescription,
        handleSubmit,
        loading,
    } = useCreatePostFeature();

    return (
        <Block className={`${blockFormStyle.blockContainer} ${blockFormStyle.blockPadding}`}>
            <Block className={blockFormStyle.addNewPostBlockDistance}>
                <Text text={"What's new?"} className={textStyles.bigTitle}></Text>
            </Block>
            <Block onClick={!fileUrl ? handleBlockClick : undefined}>
                <AnimatePresence mode={"wait"}>
                    {!fileUrl && (
                        <motion.div
                            key="upload-block"
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            transition={{duration: 0.25}}
                            className={`${blockFormStyle.blockFile}`}>
                            <InputField ref={fileInputRef}
                                        type={"file"}
                                        className={`${inputStyle.inputFileButton}`}
                                        accept={"image/*,video/*"}
                                        onChange={handleFileChange}>
                            </InputField>
                            <Media image={NewPostIcon} className={pictureStyle.addNewPostIcon}/>
                            <Text text="Add new post" className={textStyles.addNewPostText}/>
                        </motion.div>
                    )}
                    {fileUrl && (
                        <motion.div
                            key="preview-block"
                            initial={{opacity: 0, scale: 0.98}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            transition={{duration: 0.3}}
                            className={fileUploadStyle.previewContainer}>
                            {fileType.startsWith("image/") && (
                                <Media src={fileUrl} alt="preview" className={fileUploadStyle.previewMedia}
                                />
                            )}
                            {fileType.startsWith("video/") && (
                                <Media src={fileUrl} controls className={fileUploadStyle.previewMedia}
                                       as={"video"}/>
                            )}
                            <Button onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile();
                            }} className={fileUploadStyle.removeButton}>
                                ✕
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Block>
            <Block className={`${postStyles.postInputContainer} ${blockFormStyle.addNewPostBlockDistance}`}>
                <InputField type="text" placeholder='Type your amazing description . . .'
                            className={postStyles.postInput}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                />
            </Block>
            <Block className={`${postButtonStyle.buttonBlock}`}>
                <Button className={`${postButtonStyle.button}`}
                        onClick={handleSubmit}
                        type={"submit"}
                        disabled={loading}>
                    Add post
                </Button>
            </Block>
        </Block>
    )
}