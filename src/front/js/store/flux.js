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
			favorites: [], 
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

			 addFavorite: async (favoriteData) => {
				const store = getStore();
			
				// Verificar si el token está en el store
				if (!store.token) {
					console.error("Token is missing in the store.");
					return;
				}
			
				console.log("Data to send:", favoriteData);
				console.log("JWT Token:", store.token); // Verificar si el token es el correcto
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						},
						body: JSON.stringify(favoriteData)
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error adding favorite:", response.status, response.statusText, errorData);
					} else {
						const data = await response.json();
						setStore({
							favorites: [...store.favorites, data]
						});
						console.log("Favorite added successfully:", data);
					}
				} catch (error) {
					console.error("Network or server error:", error);
				}
			},
			getFavorites: async () => {
				const store = getStore();
				
				if (!store.token || store.token.split('.').length !== 3) {
					console.error("Invalid JWT Token:", store.token); // Verifica el token aquí
					return;
				}
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`,
						},
					});
			
					if (!response.ok) {
						console.error("Error fetching favorites:", response.status, response.statusText);
						return;
					}
			
					const data = await response.json();
					setStore({ favorites: data });
					console.log("Favorites fetched successfully:", data); // Verifica los datos aquí
			
				} catch (error) {
					console.error("Failed to fetch favorites:", error);
				}
			},
			  
			deleteFavorite: async (id) => {
				const store = getStore();
			
				if (!store.token) {
					console.error("Token is missing in the store.");
					return;
				}
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${id}`, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${store.token}`
						}
					});
			
					if (!response.ok) {
						console.error("Error deleting favorite:", response.status, response.statusText);
					} else {
						const updatedFavorites = store.favorites.filter(favorite => favorite.id !== id);
						setStore({ favorites: updatedFavorites });
						console.log("Favorite deleted successfully.");
					}
				} catch (error) {
					console.error("Network or server error:", error);
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
			  fetchPosterFromTMDb: async (title) => {
                const apiKey = '26d0b6690b6ca551bd0a22504613e5a9'; 
                const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        const posterPath = data.results[0].poster_path;
                        return `https://image.tmdb.org/t/p/w500${posterPath}`;
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Failed to fetch poster from TMDb:", error);
                    return null;
                }
            },
		}
	};
};

export default getState;
