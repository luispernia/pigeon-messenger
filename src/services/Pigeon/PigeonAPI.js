class Pigeon {

    constructor() {
        this.user = "";
    }

    user() {
        const signIn = async(email, password) => {
            let data = {email, password};
            let response = await fetch("http://localhost:8080/user", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type':  'application/x-www-form-urlencoded',
                  },
            })
            response = await response.json();
            this.user = response.body;
            return response;
        }

        const onAuthStatusChanged = (callback) => {
            return callback(this.user);
        }

        return {
            signIn,
            onAuthStatusChanged
        }
    }

    rooms() {
        let random = new Date().getMilliseconds() / Math.random();
        let data = {
            name: "Hello World",
            members: ["61019ddf8496ef4840cbc47a","6101a3efae9591372868e8e4","6101ae60ca56a120e893e15a"],
            admin: "61019ddf8496ef4840cbc47a",
            _id: `${random.toString().split(".")[1]}_HelloWorld`
        }

        fetch("http://localhost:8080/room", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(res => res.json()).then(val => console.log(val));
    }

}

export default Pigeon;