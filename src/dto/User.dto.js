export default class UserDTO {
    static getUserTokenFrom = (user) =>{
        return {
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            email:user.email,
            last_connection:user.last_connection,
            documents:user.documents
        }
    }

    static getUserInputFrom = (user) =>{
        return {
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            email:user.email,
            last_connection:user.last_connection,
            documents:user.documents
        }
    }
}