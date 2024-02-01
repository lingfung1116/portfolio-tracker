// fetchCompanyLogos.js
import defaultLogo from '../assets/defaultLogo.png'; // Adjust the path as necessary

const fetchCompanyLogos = async (symbols) => {
  const requests = symbols.map((symbol) =>
    fetch(process.env.REACT_APP_LOGO_API_URL.replace('symbol', symbol), {
      method: 'GET',
      headers: { accept: 'application/json' },
    })
  );

  try {
    const responses = await Promise.all(requests);
    const logosData = await Promise.all(responses.map((res) => res.json()));

    return logosData.reduce((acc, data, index) => {
      // Check if data is "ok" and has the required fields
      if (
        data.ok &&
        data.data.length > 0 &&
        data.data[0].files.mark_vector_dark
      ) {
        acc[symbols[index]] = data.data[0].files.mark_vector_dark;
      } else {
        acc[symbols[index]] = defaultLogo;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching logos:', error);
    return symbols.reduce((acc, symbol) => {
      acc[symbol] = defaultLogo;
      return acc;
    }, {});
  }
};

export default fetchCompanyLogos;
