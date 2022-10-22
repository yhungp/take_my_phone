import { Button, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import IconBox from "components/icons/IconBox"
import { IconType } from "react-icons/lib";
import { MdVideoLibrary, MdArrowForwardIos } from "react-icons/md"
import MiniStatistics from "./MiniStatistics"

export default function GeneralMinicard(
        props: {icon: IconType, func: Function, label: string}
    ) {
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

    const { icon, func, label } = props
    
    return (
        <MiniStatistics
            startContent={
                <IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={icon} color={brandColor} />}
                />
            }
            name=''
            value={label}
            endContent={
                <Button onClick={() => { func() }}>
                    <IconBox
                        w='20px'
                        h='30px'
                        icon={<Icon w='20px' h='20px' as={MdArrowForwardIos} color={brandColor} />}
                    />
                </Button>
            }
        />
    )
  }