import { useState } from "react";

export default function Registerpage(){
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    // registration function, uses fetch to the listened server
    async function register(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
        });

         //checks if the registration is valid, it will cause an error if a same username is inputted to db (will return 400), if successful otherwise will return 200
        if(response.status === 200){           
            alert('Registration Successful');
        } else{
            alert('Registration Failed');
        } 
    }

    //register page body that will uses event tag (ev)
    return(
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" 
                    placeholder="username" 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)} />
            <input type="password" 
                    placeholder="password" 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)} />
            <button>Register</button>
        </form>
    );
}