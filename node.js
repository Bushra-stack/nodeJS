
const http = require("http");
const fs = require("fs");
const welcomePage = `<html>
    <head><title>Weclomepage</title></head>
    <body><h1>We welcome you to the Game Server!</h1></body>
    <form action="create-player" method="POST">
    <div><input type="text" name="player" autofocus/></div>
    <div><button type ="submit">New Player</button></div>
    </form>
    </html>`;
const createPlayer= `<html>
    <head><title>Create Player</title></head>
    <body>
    <h1>Create Player page! </h1>
    <p>A new player has been created, go to <a href="/players"> Players Page </a> to see all Players!</p>
    </body>
    </html>`;

/* some functions */
function deleteTheEnd() {
    const toDelete=`</ul>
    </body> 
</html>`;
    console.log(toDelete+ "was deleted!");
    var data = fs.readFileSync('./players.txt', 'utf-8');
    var newValue = data.replace(toDelete, "");
    fs.writeFileSync('./players.txt', newValue, 'utf-8');
    console.log('readFileSync complete');
}
function processUserData(data) {
    return decodeURIComponent(data)
    .replace(/(.*?)=(.*)/g, (m, key, value) => value)
    .replace(/\+/g, " ");
}
function updateNotes(filename, note) {
    fs.readFile(filename, "utf-8", (error, content) => {
        if (!error){
         console.log(`Updating the notes!`);
         createNotes(filename, [content, note].join("\n"));
        }else console.error(`Could not read file ${filename}.`);
    });
}
function createNotes(filename, note) {
    console.log(`Creating note ${filename}:`, "\n", note);
    fs.re
    fs.writeFile(filename, note, error => {
        if (error) {
            console.error(`Could not create file ${filename}.`);
            console.error(error);
        }
    });
}
/* Add Player function */
/* Add a new Player to note */
function addPlayer(data) {
    deleteTheEnd();
    const filename = "./players.txt";
    const rest =
            `<li>${processUserData(data)}</li>
        </ul>
    </body> 
</html>`;
    const note =  rest;
    /*fs.exists(filename, exists => {
        if (exists) updateNotes(filename, note);
        else createNotes(filename, note);
    });*/

    /* Asynchronous modes = not blocking */
    fs
    fs.stat("./players.txt",function(err,stat){
        if(err){
            console.log(err);
        }else{
            if(stat.isFile()){
                updateNotes(filename, note);
            }else{
                createNotes(filename, note);
            }
        }
    });
}
/** Delete Player */
function deletePlayer(data){
    const note = processUserData(data);
    const wholeNote = `<li>${note}</li>`;
    console.log(note);
    var data = fs.readFileSync('./players.txt', 'utf-8');
    var newValue = data.replace(wholeNote, "");
    fs.writeFileSync('./players.txt', newValue, 'utf-8');
    console.log("delete player function!");
}

/* HTTP request callback */
function requestCallback(request, response) {
    response.statusCode = 200;
    if(request.url === "/"){
        response.setHeader("Content-Type", "text/html");
        response.end(welcomePage);
        return;
    }else if(request.url === "/players" && request.method==="POST"){
        response.setHeader("Content-Type", "text/html");
        let deleteData = "";
        request.on("data", chunk => {
            deleteData += chunk.toString();
            deletePlayer(deleteData);
        });
        response.writeHead(302, { Location: "/players"});
        return response.end();
    }else if(request.url === "/players"){
        response.setHeader("Content-Type", "text/html");
        var myReadStraem = fs.createReadStream(__dirname+'/players.txt', 'utf8');
       // var myWriteStream = fs.createWriteStream()
        myReadStraem.pipe(response);
        
    }else if(request.url === "/create-player" && request.method==="POST"){
        response.setHeader("Content-Type", "text/html");
        console.log(request.method);
        let data = "";
        request.on("data", chunk => {
            data += chunk.toString();
            addPlayer(data);
        });
        request.on("end", () => {
            return response.end(createPlayer);
        });
    }
}

/* Create a http server */
const server = http.createServer(requestCallback);


const hostname = "0.0.0.0";
const port = 3000;
function serverCallback(){
    console.log(`Server running at http://${hostname}:${port}/`);
}
/* listen to Requests */
server.listen(port, hostname, serverCallback);