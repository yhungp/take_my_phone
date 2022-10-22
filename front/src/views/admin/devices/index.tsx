/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, Button, Icon, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
// Custom components
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import GeneralMinicard from 'components/card/GeneralMiniCard';
import { useEffect, useLayoutEffect, useState } from 'react';
import { MdApps, MdArrowForwardIos, MdFolder, MdImage, MdMusicNote, MdVideoLibrary } from 'react-icons/md';
import { columnsAppData, columnsDataCheck } from 'views/admin/default/variables/columnsData';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck.json';
import DeviceApps from '../default/components/DeviceApps';
import CheckTable from './components/CheckTable';

export default function UserReports() {
	var [selected, setSelected] = useState(0)

	const [apps, setApps] = useState([
		{
			"name":["",false],
			"type": "", 
			"size": 0,
			"version": "12 Jan 2021",
			"delete": ""
	  	}
	])
	
	const [appsLoaded, setAppsLoaded] = useState(true)
	const [totalPages, setPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(0)

	const [componentToShow, setComponentToShow] = useState(
		<DeviceApps 
			columnsData={columnsAppData} 
			tableData={apps}
			pages={0}
			currentPage={0}
			setPage={setPage}
			apps={apps}
		/>
	)

	useEffect(() => {
		setAppsLoaded(false)

		console.log(selected)

		fetch("http://localhost:8080/device-apps/6effc419")
			.then(res => res.json())
			.then(
			(result) => {
				var apps_loaded: { 
					name: any[]; 
					type: string; 
					size: any; 
					version: string;
					delete: string; 
				}[] = []
				
				if (result == null) {
				// setCount((count) => 0)
				}
				else {
					for (let r in result) {
						apps_loaded.push({
								"name":[result[r][1],false,result[r][0]],
								"type": "", 
								"size": [
									result[r][2],
									result[r][3],
									result[r][4]
								],
								"version": result[r][5],
								"delete": ""
							},
						);
					}
					
					var pages = Math.round(apps_loaded.length / 10)

					setApps(apps_loaded)
					setPages(pages)
					
					setComponentToShow(
						<DeviceApps 
							columnsData={columnsAppData} 
							tableData={apps_loaded.slice(0, 10)}
							pages={pages}
							currentPage={0}
							setPage={setPage}
							apps={apps_loaded}
						/>
					)
				}
			},
			(error) => {
				// setCount((i) => 0)
			}
		)
	}, []);

	function setPage( upDown: boolean, apps_list: any, pages: number, current: number){
		var page = 0
		if (current > 0 && !upDown){
			page = current - 1
			setCurrentPage(current - 1)
			
			setComponentToShow(
				<DeviceApps 
					columnsData={columnsAppData} 
					tableData={apps_list.slice(page * 10, page * 10 + 10)}
					pages={pages}
					currentPage={page}
					setPage={setPage}
					apps={apps_list}
				/>
			)
		}
		else if (current < pages - 1 && upDown){
			page = current + 1
			setCurrentPage(current + 1)

			setComponentToShow(
				<DeviceApps 
					columnsData={columnsAppData} 
					tableData={apps_list.slice(page * 10, page * 10 + 10)}
					pages={pages}
					currentPage={page}
					setPage={setPage}
					apps={apps_list}
				/>
			)
		}
	}

	async function componentDidMount() {
		// POST request using fetch with async/await
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path: '/' })
		};
		const response = await fetch('http://localhost:8080/list-files/', requestOptions);
		const data = await response.json();

		console.log(data)
	}

	function toShow(index: any){
		// handleClick(index)
		setSelected(selected => index)
		
		switch (index){
			case 0:
				setComponentToShow(
					<DeviceApps 
						columnsData={columnsAppData} 
						tableData={apps}
						pages={0}
						currentPage={0}
						setPage={setPage}
						apps={apps}
					/>
				)
				break;
			case 1:
				componentDidMount()

				setComponentToShow(
					<CheckTable 
						columnsData={columnsDataCheck} 
						tableData={tableDataCheck}
					/>
				)
				break;
			// case 2:
			// 	setComponentToShow(
			// 		<DeviceApps 
			// 			columnsData={columnsAppData} 
			// 			tableData={apps}
			// 		/>
			// 	)
			// 	break;
			// case 3:
			// 	setComponentToShow(
			// 		<DeviceApps 
			// 			columnsData={columnsAppData} 
			// 			tableData={apps}
						
			// 		/>
			// 	)
			// 	break;
			// case 4:
			// 	setComponentToShow(
			// 		<DeviceApps 
			// 			columnsData={columnsAppData} 
			// 			tableData={apps}
						
			// 		/>
			// 	)
			// 	break;
			// case 5:
			// 	setComponentToShow(
			// 		<DeviceApps 
			// 			columnsData={columnsAppData} 
			// 			tableData={apps}
						
			// 		/>
			// 	)
			// 	break;
		}
	}

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }} gap='20px' mb='20px'>
				<GeneralMinicard 
					icon={MdApps} func={() => toShow(0)} label={"Apps"} />
				
				<GeneralMinicard
					icon={MdFolder} func={() => toShow(1)} label={"Files"} />
				
				<GeneralMinicard 
					icon={MdMusicNote} func={() => toShow(2)} label={"Music"} />
				
				<GeneralMinicard 
					icon={MdVideoLibrary} func={() => toShow(3)} label={"Video"} />
				
				<GeneralMinicard 
					icon={MdImage} func={() => toShow(4)} label={"Images"} />
				
				<GeneralMinicard 
					icon={MdFolder} func={() => toShow(5)} label={"Information"} />
			</SimpleGrid>

			<SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
				{
					componentToShow
				}
			</SimpleGrid>
		</Box>
	);
}