import CartParser from './CartParser';
import * as uuid from 'uuid';
import fs from 'fs';

const csvItem = () => {
	const csvData = fs.readFileSync('./samples/cart.csv', 'utf8');
	const csvArray = csvData.trim().split(/\r?\n/);
	const csvLine = csvArray[1];
	return csvLine
}
let parser;

beforeEach(() => {
	parser = new CartParser();
});

describe('CartParser - unit tests', () => {

	test('Check overall sum', () => {
		const data = [
			{
				price: 0,
				quantity: 0
			},
			{
				price: 5,
				quantity: 100
			}
		];
		const dataWithOneItem = [{
			price: -50,
			quantity: 2
		}]

		expect(parser.calcTotal(data)).toBe(500)
		expect(parser.calcTotal([])).toBe(0)
		expect(parser.calcTotal(dataWithOneItem)).toBe(-100)
	})

	test('correctness of creating an object based on a string from a CSV file', () => {
		function createExpeсtedCardFromCSVLine(csv) {
			const [name, price, quantity] = csv.split(',')
			return {
				name: name,
				price: parseFloat(price),
				quantity: parseInt(quantity)
			}
		}

		const parsedItem = parser.parseLine(csvItem());
		const expectedItem = createExpeсtedCardFromCSVLine(csvItem())

		expect(parsedItem).toMatchObject(expectedItem);
	})

	test('verification of ID and its uniqueness', () => {
		const allItems = []
		const parsedItem = parser.parseLine(csvItem());
		for (let i = 0; i < 100; i++) {
			allItems.push(parser.parseLine(csvItem()))
		}
		const uniqueId = new Set(allItems.map(item => item.id));
		
		expect(uniqueId.size).toBe(allItems.length)
		expect(parsedItem.id).toBeDefined();
		expect(uuid.validate(parsedItem.id)).toBeTruthy()
	})

	test('function readFile() reads file content correctly', () => {
		const testData = 'Hello world'
		const tempFilePath = './test.txt'

		fs.writeFileSync(tempFilePath, testData);
		const result = parser.readFile(tempFilePath);

		expect(result).toBe(testData)
		fs.unlinkSync(tempFilePath);
	});

	test('function validate() returns an empty array if file is valid', () => {
		const validFile = 'Product name,Price,Quantity\n' +
			'Mollis consequat,9.00,2\n' +
			'Tvoluptatem,10.32,1';

		expect(parser.validate(validFile)).toEqual([])
	})

	test('function validate() returns errors if some rows have an incorrect number of cells', () => {
		const invalidFile = 'Product name,Price,Quantity\n' +
			'Mollis consequat,9.00\n' +
			'Tvoluptatem,10.32,1';
		const expectedErrors = [
			{
				type: parser.ErrorType.ROW,
				rowIndex: 1,
				columnIndex: -1,
				message: 'Expected row to have 3 cells but received 2.',
			},
		];

		const actualErrors = parser.validate(invalidFile)

		expect(actualErrors).toHaveLength(expectedErrors.length)
	})

	test('function validate() check if some of cells have incorrect data type', () => {
		const invalidFile = 'Product name,Price,Quantity\n' +
			'Mollis consequat,hello world, 2\n' +
			'Tvoluptatem,10.32,1';
		const expectedErrors = [
			{
				type: parser.ErrorType.CELL,
				rowIndex: 1,
				columnIndex: 1,
				message: 'Expected cell to be a positive number but received "hello world".',
			},
		];

		const actualErrors = parser.validate(invalidFile)

		expect(parser.validate(invalidFile)).toHaveLength(expectedErrors.length)
	})

	test('should throw an error if file doesn"t exist', () => {
		const nonExistentPath = '/path/file.csv';
		
		expect(() => parser.parse(nonExistentPath)).toThrow()
	})




});

describe('CartParser - integration test', () => {
	// Add your integration test here.
});
