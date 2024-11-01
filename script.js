const tableBody = document.getElementById('table-body')
const tableFooter = document.getElementById('table-footer')
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')
const loadingSpinner = document.getElementById('loading-spinner')

let coins = []
let currentPage = 1
const perPage = 10

const fetchData = async () => {
	try {
		loadingSpinner.style.display = 'block'
		const resp = await fetch('https://api.coinlore.net/api/tickers/')
		const data = await resp.json()

		coins = [...data?.data]
		renderTable(currentPage)
	} catch (error) {
		loadingSpinner.style.display = 'none'
		console.error('Error fetching data', error)
	} finally {
		loadingSpinner.style.display = 'none'
	}
}

const paginate = page => {
	return coins?.slice((page - 1) * perPage, page * perPage)
}

const totalPages = () => {
	return Math.ceil(coins.length / perPage)
}

const renderTable = page => {
	tableBody.innerHTML = ''
	const data = paginate(page)

	data?.forEach(coin => {
		const tr = document.createElement('tr')

		tr.innerHTML = `
			<td data-label="💰 Coin">${coin.name}</td>
			<td data-label="📝 Code">${coin.symbol}</td>
			<td data-label="🤑 Price">${formatCurrency(coin.price_usd)}</td>
			<td data-label="📈 Total Supply">${coin.tsupply} ${coin.symbol}</td>
		`

		tableBody.appendChild(tr)
	})

	prevBtn.style.display = page === 1 ? 'none' : 'block'
	nextBtn.style.display = page === totalPages() ? 'none' : 'block'
}

const goToNextPage = () => {
	if (currentPage > coins.length / perPage) return

	currentPage++
	renderTable(currentPage)
}

const goToPrevPage = () => {
	if (currentPage <= 1) return

	currentPage--
	renderTable(currentPage)
}

const formatCurrency = amount => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(Number(amount))
}

// event handlers
nextBtn.addEventListener('click', goToNextPage)
prevBtn.addEventListener('click', goToPrevPage)

fetchData()
