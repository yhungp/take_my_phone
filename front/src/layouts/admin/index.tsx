/* eslint-disable @typescript-eslint/no-unused-vars */
// Chakra imports
import { Portal, Box, useDisclosure, Icon } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { useState } from 'react';
import { MdBarChart, MdHome, MdOutlineShoppingCart, MdPerson, MdPhoneAndroid } from 'react-icons/md';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from 'routes';
import MainDashboard from 'views/admin/default';
import Devices from 'views/admin/devices';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import RTL from 'views/admin/rtl';

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
	const { ...rest } = props;
	// states and functions
	const [ fixed ] = useState(false);
	const [ toggleSidebar, setToggleSidebar ] = useState(false);
	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/admin/full-screen-maps';
	};
	const getActiveRoute = (routes: RoutesType[]): string => {
		let activeRoute = 'Default Brand Text';
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return activeRoute;
	};
	const getActiveNavbar = (routes: RoutesType[]): boolean => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].secondary;
			}
		}
		return activeNavbar;
	};
	const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return activeNavbar;
	};
	const getRoutes = (routes: RoutesType[]): any => {
		return routes.map((route: RoutesType, key: any) => {
			if (route.layout === '/admin') {
				return <Route path={route.layout + route.path} component={route.component} key={key} />;
			} else {
				return null;
			}
		});
	};

	const [routes, setR] = useState([
		{
			name: 'Main',
			layout: '/admin',
			path: '/default',
			icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
			component: Devices
		},
	])
	
	function setRoutes(){
		fetch("http://localhost:8080/devices")
			.then(res => res.json())
			.then(
			(result) => {
				if (result == null) {
				// setCount((count) => 0)
				}
				else {
					const listItems = [];
					listItems.push(routes[0])

					for (const element of result){
						listItems.push(
							{
								name: element,
								layout: '/admin',
								path: '/' + element,
								icon: <Icon as={MdPhoneAndroid} width='20px' height='20px' color='inherit' />,
								component: MainDashboard
							}
						)
					}

					setR(listItems)
				}
			},
			(error) => {
				// setCount((i) => 0)
			}
		)
	}

	document.documentElement.dir = 'ltr';
	const { onOpen } = useDisclosure();
	return (
		<Box>
			<SidebarContext.Provider
				value={{
					toggleSidebar,
					setToggleSidebar
				}}>
				<Sidebar routes={routes} setRoutes={setRoutes} display='none' {...rest}  />
				<Box
					float='right'
					minHeight='100vh'
					height='100%'
					overflow='auto'
					position='relative'
					maxHeight='100%'
					w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
					maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
					transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
					transitionDuration='.2s, .2s, .35s'
					transitionProperty='top, bottom, width'
					transitionTimingFunction='linear, linear, ease'>
					<Portal>
						<Box>
							<Navbar
								onOpen={onOpen}
								logoText={'Horizon UI Dashboard PRO'}
								brandText={getActiveRoute(routes)}
								secondary={getActiveNavbar(routes)}
								message={getActiveNavbarText(routes)}
								fixed={fixed}
								{...rest}
							/>
						</Box>
					</Portal>

					{getRoute() ? (
						<Box mx='auto' p={{ base: '20px', md: '30px' }} pe='20px' minH='100vh' pt='50px'>
							<Switch>
								{getRoutes(routes)}
								<Redirect from='/' to='/admin/default' />
							</Switch>
						</Box>
					) : null}
					<Box>
						<Footer />
					</Box>
				</Box>

				
				
			</SidebarContext.Provider>
		</Box>
	);
}
