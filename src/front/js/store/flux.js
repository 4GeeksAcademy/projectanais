const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			isLoggedIn: false,
			favoriteMovies: [],
			favoriteSeries: [],
			viewedRecommendations: new Set()  // <-- Estoy usando un Set en lugar de una lista, esto es nuevo
		},
		actions: {
			// Use getActions to call a function within a function
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			requestPasswordReset: async (email) => {
				const url = process.env.BACKEND_URL + '/api/request-password-reset';
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email })
				});
			
				if (!response.ok) {
					console.log("Error al enviar solicitud de restablecimiento de contraseña:", response.status, response.statusText);
					return null;
				}
			
				const data = await response.json();
				return data.message; 
			},
			signup: async (email, password, navigate) => {
				const url = `${process.env.BACKEND_URL}/api/signup`;
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ email, password })
				};
				const response = await fetch(url, options);
				if (!response.ok) {
					const errorData = await response.json();
					console.log("Error al registrar usuario:", response.status, response.statusText, errorData.error);
					return;
				}
				const data = await response.json();
				localStorage.setItem('token', data.access_token); // Guardo el token en el localStorage
				navigate('/');
			},
			login: async (email, password) => {
				const url = process.env.BACKEND_URL + '/api/login';
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ email, password })
				});

				if (!response.ok) {
					console.log("Error al iniciar sesión:", response.status, response.statusText);
					return;
				}

				const data = await response.json();
				if (data.access_token) {
					setStore({
						token: data.access_token,
						isLoggedIn: true,
						user: data.results
					});
					sessionStorage.setItem('token', data.access_token);
					sessionStorage.setItem('user', JSON.stringify(data.results));
					return data;
				}
			},
			logout: () => {
				setStore({ isLoggedIn: false });
				localStorage.removeItem('token');
				sessionStorage.removeItem('token');
				window.location.href = "/"; // Redirigir a la página de inicio
			},
			getFavorites: async () => {
				const url = process.env.BACKEND_URL + '/api/users/favorites';
				const token = sessionStorage.getItem('token');
				const response = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});
				if (!response.ok) {
					console.error("Error fetching favorites:", response.status, response.statusText);
					return;
				}
				const data = await response.json();
				setStore({ favoriteMovies: data.favorite_movies, favoriteSeries: data.favorite_series });
			},

			addFavoriteMovie: async (movieId) => {
				const url = process.env.BACKEND_URL + `/api/users/favorite/movies/${movieId}`;
				const token = sessionStorage.getItem('token'); // Otra vez el token de sessionStorage
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}` // El token de los huevos
					}
				});
				if (!response.ok) {
					console.error("Error adding favorite movie:", response.status, response.statusText);
					return;
				}
				await getActions().getFavorites(); // Actualiza cuando termina la funcion q esta await
			},
			addFavoriteSeries: async (seriesId) => {
				const url = process.env.BACKEND_URL + `/api/users/favorite/series/${seriesId}`;
				const token = sessionStorage.getItem('token');
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ series_id: seriesId })
				});
				if (response.ok) {
					await getActions().getFavorites();
				} else {
					console.error("Error adding favorite series:", response.status, response.statusText);
				}
			},
			getRecommendations: async (prompt, exclude = []) => {
				const store = getStore();
				const url = process.env.BACKEND_URL + '/api/get-recommendations';
				const token = sessionStorage.getItem('token');
				const response = await fetch(url, {
				  method: "POST",
				  headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				  },
				  body: JSON.stringify({ prompt, exclude })
				});
			  
				if (!response.ok) {
				  console.log("Error al obtener recomendaciones:", response.status, response.statusText);
				  return [];
				}
			  
				const data = await response.json();
				const newRecommendations = data.recommendations.filter(rec => !store.viewedRecommendations.has(rec.title));
			  
				// Actualizo el store con las nuevas recomendaciones vistas
				const updatedViewedRecommendations = new Set([...store.viewedRecommendations, ...newRecommendations.map(rec => rec.title)]);
				setStore({
				  viewedRecommendations: updatedViewedRecommendations
				});
			  
				console.log("New Recommendations:", newRecommendations);  // Add this line to log new recommendations
			  
				return newRecommendations;
			  },
		}
	};
};

export default getState;
