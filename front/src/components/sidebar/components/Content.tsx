// chakra imports
import { Box, Flex, Stack, useDisclosure } from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';

// FUNCTIONS

function SidebarContent(props: { routes: RoutesType[], setRoutes: Function }) {
	const { routes, setRoutes } = props;
	const { isOpen, onOpen, onClose } = useDisclosure()
	// SIDEBAR
	return (
		<Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
			<Brand />
			<Stack direction='column' mt='8px' mb='auto'>
				<Box ps='20px' pe={{ lg: '16px', '2xl': '16px' }}>
					<Links routes={routes} />
				</Box>
			</Stack>

			<Box ps='20px' pe={{ lg: '16px', '2xl': '20px' }} mt='60px' mb='40px' borderRadius='30px'>
				<SidebarCard routes={routes} setRoutes={setRoutes} />
			</Box>
		</Flex>
	);
}

export default SidebarContent;
