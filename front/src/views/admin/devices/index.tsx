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
import { useEffect, useState } from 'react';
import { MdApps, MdArrowForwardIos, MdFolder, MdImage, MdMusicNote, MdVideoLibrary } from 'react-icons/md';
import { columnsAppData, columnsDataCheck } from 'views/admin/default/variables/columnsData';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck.json';
import DeviceApps from '../default/components/DeviceApps';

export default function UserReports() {
	const apps = [
		{
			"name":["Facebook",false],
			"type": "Social", 
			"size": 1024,
			"version": "12 Jan 2021",
			"delete": ""
	  	},
		{
			  "name":["Call of Duty: Mobil",false],
			  "type": "Games", 
			  "size": 1024,
			  "version": "12 Jan 2021",
			  "delete": ""
		},
		{
			  "name":["Youtube",false],
			  "type": "Social", 
			  "size": 1024,
			  "version": "12 Jan 2021",
			"delete": ""
		},
	]

	var [selected, setSelected] = useState(0)

	const tabs = [
		'Apps',
		'Files',
		'Music',
		'Video',
		'Images',
		'Information'
	]
	  
	// Chakra Color Mode
	// const brandColor = useColorModeValue('brand.500', 'white');
	// const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

	// const [apps, setApps] = useState([])
	
	const [componentToShow, setComponentToShow] = useState(
		<DeviceApps 
			columnsData={columnsAppData} 
			tableData={apps}
		/>
	)

	useEffect(() => {
		fetch("http://localhost:8080/devices")
			.then(res => res.json())
			.then(
			(result) => {
				if (result == null) {
				// setCount((count) => 0)
				}
				else {
					
				}
			},
			(error) => {
				// setCount((i) => 0)
			}
		)
	});

	function toShow(index: any){
		setSelected(index)

		switch (index){
			case 0:
				setComponentToShow(
					<DeviceApps 
						columnsData={columnsAppData} 
						tableData={apps}
					/>
				)
				break;
			case 1:
				setComponentToShow(
					<DeviceApps 
						columnsData={columnsDataCheck} 
						tableData={tableDataCheck}
					/>
				)
				break;
			case 2:
				setComponentToShow(
					<DeviceApps 
						columnsData={columnsAppData} 
						tableData={apps}
					/>
				)
				break;
			case 3:
				setComponentToShow(
					<DeviceApps 
						columnsData={columnsAppData} 
						tableData={apps}
					/>
				)
				break;
			case 4:
				setComponentToShow(
					<DeviceApps 
						columnsData={columnsAppData} 
						tableData={apps}
					/>
				)
				break;
			case 5:
				setComponentToShow(
					<DeviceApps 
						columnsData={columnsAppData} 
						tableData={apps}
					/>
				)
				break;
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
					apps.length !== 0 ? componentToShow : null
				}
			</SimpleGrid>
		</Box>
	);
}
