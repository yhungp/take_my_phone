import { Flex, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Button, Icon, Center, FormLabel, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import IconBox from 'components/icons/IconBox';
import { MdArrowBackIos, MdArrowForwardIos, MdDelete } from 'react-icons/md';
import { columnsAppData } from '../variables/columnsData';
;
export default function CheckTable(props: { 
		columnsData: any; 
		tableData: any;
		currentPage: number;
		pages: number,
		setPage: any,
		apps: any
	}) {
	const { 
		columnsData, 
		tableData, 
		currentPage, 
		pages, 
		setPage,
		apps,
	} = props;

	const [customColumnsData, setCustomColumnsData] = useState(columnsData)

	useLayoutEffect(() => {
		function updateSize() {
			if (window.innerWidth < 1000) {
				var columnsData = customColumnsData.filter((item: { [x: string]: string; }) => item['Header'] !== "VERSION");
				setCustomColumnsData(columnsData)
			}
			else {
				setCustomColumnsData(columnsAppData)
			}
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	function trunc(text: string) {
		return text.length > 12 ? `${text.substring(0, 12)}...` : text;
	}

	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

	const columns = useMemo(() => customColumnsData, [ customColumnsData ]);
	const data = useMemo(() => tableData, [ tableData ]);

	let tableInstance = useTable(
		{
			columns,
			data
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, initialState } = tableInstance;
	initialState.pageSize = 10;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const textColorSecondary = 'secondaryGray.600';

	function formatBytes(bytes: number, decimals = 2) {
		if (!+bytes) return '0 Bytes'
	
		const k = 1000
		const dm = decimals < 0 ? 0 : decimals
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	
		const i = Math.floor(Math.log(bytes) / Math.log(k))
	
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
	}

	return (
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px='25px' justify='space-between' align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					Apps
				</Text>
				<Menu />
			</Flex>
			<Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
				<Thead>
					{headerGroups.map((headerGroup: any, index: number) => (
						<Tr {...headerGroup.getHeaderGroupProps()} key={index}>
							{headerGroup.headers.map(
								(
									column: {
										render(a: string): JSX.Element;
										getHeaderProps(a: any): any;
										getSortByToggleProps(): any;
									},
									index: number
								) => (
									<Th
										{...column.getHeaderProps(column.getSortByToggleProps())}
										pe='10px'
										key={index}
										borderColor={borderColor}>
										<Flex
											justify='space-between'
											align='center'
											fontSize={{ sm: '10px', lg: '12px' }}
											color='gray.400'>
											{
												column.render('Header').toString() !== 'DELETE' ?
													column.render('Header')
													:
													null
											}
										</Flex>
									</Th>
								)
							)}
						</Tr>
					))}
				</Thead>
				
				<Tbody {...getTableBodyProps()}>
					{page.map((row: any, index: number) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()} key={index}>
								{row.cells.map((cell: any, index: number) => {
									let data;
									if (cell.column.Header === 'NAME') {
										data = (
											<Flex align='center' minW={"200px"}>
												<Checkbox
													defaultChecked={cell.value[1]}
													colorScheme='brandScheme'
													me='10px'
												/>
												{/* <Text color={textColor} fontSize='sm' fontWeight='700'>
													{cell.value[0]}
												</Text> */}

												<Stat my='auto' ms={'18px'}>
													<Text color={textColor} fontSize='sm' fontWeight='700'>
														{cell.value[0]}
													</Text>

													{
														cell.value[0] !== cell.value[2] ?
															<Text color={textColorSecondary} fontSize='sm' fontWeight='700'>
																{cell.value[2]}
															</Text>
															: null
													}
												</Stat>
											</Flex>
										);
									} else if (cell.column.Header === 'SIZE') {
										data = (
											<>
												<Text color={textColor} fontSize='sm' fontWeight='700' minW={"100px"}>
													App: {formatBytes(cell.value[0])}
												</Text>
												<Text color={textColor} fontSize='sm' fontWeight='700' minW={"100px"}>
													Data: {formatBytes(cell.value[1])}
												</Text>
												<Text color={textColor} fontSize='sm' fontWeight='700' minW={"100px"}>
													Cache: {formatBytes(cell.value[2])}
												</Text>
											</>
										);
									} else if (cell.column.Header === 'VERSION' && window.innerWidth > 1000) {
										data = (
											<Text color={textColor} fontSize='sm' fontWeight='700'>
												{trunc(cell.value)}
											</Text>
										);
									} 
									else if (cell.column.Header === 'DELETE') {
										data = (
											<Button>
												<IconBox
													w='10px'
													h='10px'
													bg={boxBg}
													icon={<Icon w='25px' h='25px' as={MdDelete} color={brandColor} />}
												/>
											</Button>
										);
									}
									return (
										<Td
											{...cell.getCellProps()}
											key={index}
											fontSize={{ sm: '14px' }}
											maxW={
												cell.column.Header === 'NAME' ? 
												'auto'
												:
												{ sm: '100px', md: '100px', lg: '100px' }
											}
											minW={{ sm: '50px', md: '50px', lg: 'auto' }}
											borderColor='transparent'>
											{data}
										</Td>
									);
								})}
							</Tr>
						);
					})}
				</Tbody>
			</Table>

			<Center>
				<Button w={"50px"}
					onClick={()=>{
						setPage(false, apps, pages, currentPage)
					}}
					>
					<IconBox
						w='20px'
						h='20px'
						icon={<Icon w='15px' h='15px' 
						as={MdArrowBackIos} color={brandColor} />}
					/>
				</Button>

				<FormLabel marginLeft={"5"} marginRight={"5"}>
					{currentPage + 1}  /  {pages}
				</FormLabel>

				<Button w={"50px"}
					onClick={()=>{
						setPage(true, apps, pages, currentPage)
					}}>
					<IconBox
						w='20px'
						h='20px'
						icon={<Icon w='15px' h='15px' 
						as={MdArrowForwardIos} color={brandColor} />}
					/>
				</Button>
			</Center>
		</Card>
	);
}
