/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Flex, Image, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import routes from 'routes';
// import logoWhite from 'assets/img/layout/logoWhite.png';
import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdPerson, MdHome, MdLock, MdOutlineShoppingCart, MdPhoneAndroid } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import { useState } from 'react';

export default function SidebarDocs(
	props: { routes: RoutesType[], setRoutes: Function }) {
	// const bgColor = 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)';
	// const borderColor = useColorModeValue('white', 'navy.800');

	var { setRoutes } = props;
	const { isOpen, onOpen, onClose } = useDisclosure()

	const [routes, setR] = useState([
		{
			name: 'Main Dashboard',
			layout: '/admin',
			path: '/default',
			icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
			component: MainDashboard
		},
	])

	const numbers = [1, 2, 3, 4, 5];
	const [listItems, setListItems] = useState([].map((number) =>
		<li>{number}</li>
	));


	function setRoute(){
		fetch("http://localhost:8080/devices")
			.then(res => res.json())
			.then(
			(result) => {
				if (result == null) {
				// setCount((count) => 0)
				}
				else {
					const listItems = [];

					for (const element of result){
						listItems.push(
							{
								name: element,
								layout: '/admin',
								path: '/default',
								icon: <Icon as={MdPhoneAndroid} width='20px' height='20px' color='inherit' />,
								component: MainDashboard
							}
						)
					}

					setR(listItems)
					setListItems(result.map((number:string) =>
						<p>
							{number}
							<Button
								// onClick={() => setRoutes()}
								bg='whiteAlpha.300'
								_hover={{ bg: 'whiteAlpha.200' }}
								_active={{ bg: 'whiteAlpha.100' }}
								mb={{ sm: '16px', xl: '24px' }}
								color={'white'}
								fontWeight='regular'
								fontSize='sm'
								minW='260'
								mx='auto'>
									Add device
							</Button>
						</p>
					))
				}
			},
			(error) => {
				// setCount((i) => 0)
			}
		)
	}

	return (
		<>
			<Button
				// onClick={() => setRoutes()}
				onClick={() => {
					setRoute()
					onOpen()
				}}
				bg='whiteAlpha.300'
				_hover={{ bg: 'whiteAlpha.200' }}
				_active={{ bg: 'whiteAlpha.100' }}
				mb={{ sm: '16px', xl: '24px' }}
				color={'white'}
				fontWeight='regular'
				fontSize='sm'
				minW='260'
				mx='auto'>
				Add new device
			</Button>

			{listItems.length !== 0 ?
				<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Devices</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{listItems}
					</ModalBody>
				</ModalContent>
			</Modal>
			:
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Devices</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						No devices connected
					</ModalBody>
				</ModalContent>
			</Modal>}
		</>
		// <Flex
		// 	justify='center'
		// 	direction='column'
		// 	align='center'
		// 	bg={bgColor}
		// 	borderRadius='30px'
		// 	me={{ base: '20px' }}
		// 	position='relative'>
		// 		<Button
		// 			bg='whiteAlpha.300'
		// 			_hover={{ bg: 'whiteAlpha.200' }}
		// 			_active={{ bg: 'whiteAlpha.100' }}
		// 			mb={{ sm: '16px', xl: '24px' }}
		// 			color={'white'}
		// 			fontWeight='regular'
		// 			fontSize='sm'
		// 			minW='185px'
		// 			mx='auto'>
		// 			Upgrade to PRO
		// 		</Button>
		// 	<Flex
		// 		border='5px solid'
		// 		borderColor={borderColor}
		// 		bg='linear-gradient(135deg, #868CFF 0%, #4318FF 100%)'
		// 		borderRadius='50%'
		// 		w='94px'
		// 		h='94px'
		// 		align='center'
		// 		justify='center'
		// 		mx='auto'
		// 		position='absolute'
		// 		left='50%'
		// 		top='-47px'
		// 		transform='translate(-50%, 0%)'>
		// 		<Image src={logoWhite} w='40px' h='40px' />
		// 	</Flex>
		// 	<Flex direction='column' mb='12px' align='center' justify='center' px='15px' pt='55px'>
		// 		<Text
		// 			fontSize={{ base: 'lg', xl: '18px' }}
		// 			color='white'
		// 			fontWeight='bold'
		// 			lineHeight='150%'
		// 			textAlign='center'
		// 			px='10px'
		// 			mb='14px'>
		// 			Upgrade to PRO
		// 		</Text>
		// 		<Text fontSize='14px' color={'white'} px='10px' mb='14px' textAlign='center'>
		// 			Improve your development process and start doing more with Horizon UI PRO!
		// 		</Text>
		// 	</Flex>
		// 	<Link href='https://horizon-ui.com/pro'>
		// 		<Button
		// 			bg='whiteAlpha.300'
		// 			_hover={{ bg: 'whiteAlpha.200' }}
		// 			_active={{ bg: 'whiteAlpha.100' }}
		// 			mb={{ sm: '16px', xl: '24px' }}
		// 			color={'white'}
		// 			fontWeight='regular'
		// 			fontSize='sm'
		// 			minW='185px'
		// 			mx='auto'>
		// 			Upgrade to PRO
		// 		</Button>
		// 	</Link>
		// </Flex>
	);
}
