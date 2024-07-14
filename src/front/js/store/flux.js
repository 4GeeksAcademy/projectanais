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
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
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
				const uri = process.env.BACKEND_URL + '/request-password-reset';
				const response = await fetch(uri, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ email })
				});
		
				if (!response.ok) {
					console.log("Error al solicitar el restablecimiento de contraseña", response.status, response.statusText);
					return;
				}
		
				const data = await response.json();
				if (data.message) {
					return data.message; // Devuelve un messge de éxito o fallo
				}
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
					return;  // No devolver nada si hay un error
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
					return data;  // Devuelve los datos de la sesión si todo es correcto
				}
			},
		}
	};
};

export default getState;
