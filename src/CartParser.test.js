import CartParser from './CartParser';
import * as uuid from 'uuid';
import fs from 'fs';

let parser;

beforeEach(() => {
	parser = new CartParser();
});

describe('CartParser - unit tests', () => {
	// Add your unit tests here.
	// test('Correctness of input data', () => {
	// 	expect(parser.createError())
	// })

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
		const csvData = fs.readFileSync('./samples/cart.csv', 'utf8');
		const csvArray = csvData.trim().split(/\r?\n/);
		const allItems = []
		const csvLine = csvArray[1];
		const parsedItem = parser.parseLine(csvLine);
		const expectedItem = createExpeсtedCardFromCSVLine(csvLine)
		for (let i = 0; i < 100; i++) {
			allItems.push(parser.parseLine(csvLine))
		}
		const uniqueId = new Set(allItems.map(item => item.id));
		expect(uniqueId.size).toBe(allItems.length)
		expect(parsedItem).toMatchObject(expectedItem);
		expect(parsedItem.id).toBeDefined();
		expect(uuid.validate(parsedItem.id)).toBeTruthy()
	})

	test('function readFile reads file content correctly', () => {
		const testData = 'Hello world'
		const tempFilePath = './test.txt'
		fs.writeFileSync(tempFilePath, testData);
		const result = parser.readFile(tempFilePath);
		expect(result).toBe(testData)
	});
});

describe('CartParser - integration test', () => {
	// Add your integration test here.
});
