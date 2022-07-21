// window.matchMedia = jest.fn().mockImplementation(query => {
// 	return {
// 		matches: false,
// 		media: query,
// 		onchange: null,
// 		addListener: jest.fn(),
// 		removeListener: jest.fn(),
// 	};
// });

global.matchMedia = global.matchMedia || function () {
	return {
		addListener: jest.fn(),
		removeListener: jest.fn(),
	};
};