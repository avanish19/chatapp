class Users{
	constructor (){
		this.users =[];
	}
	addUser(id,Dname,jrname){
		var user = {id,Dname,jrname};
		this.users.push(user);
		return user;
		
	}
	removeUser (id){
		var user = this.getUser(id);
		if(user){
			this.users = this.users.filter((user)=>user.id!==id);
		}
		return user;

	}
	getUser(id){
		return this.users.filter((user) =>user.id===id)[0]

	}
	getUserList(jrname){
		var users = this.users.filter((user)=> user.jrname===jrname);
		var namesArray = users.map((user)=>user.Dname);
		return namesArray;
	}
}

module.exports= {Users};