import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { collection, addDoc, getFirestore, deleteDoc, doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxj64MXycHICa6baO50lrUfxI4ennf7X8",
    authDomain: "chat-app-84495.firebaseapp.com",
    projectId: "chat-app-84495",
    storageBucket: "chat-app-84495.appspot.com",
    messagingSenderId: "1083012808763",
    appId: "1:1083012808763:web:b98048dd1b20f91f85dc1e"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const ids = []

async function getTodos() {

    onSnapshot(collection(db, "users"), (data) => {
        data.docChanges().forEach((change) => {
            // console.log(change.doc.data())
            // console.log(change)
            ids.push(change.doc.id)
            var dTodo = document.getElementById(change.doc.id)
            if (change.type === "removed") {
                // var dTodo = document.getElementById(change.doc.id)
                if (dTodo) {
                    dTodo.remove()
                }
            }
            else if (change.type === "added") {
                var list = document.getElementById("list");
                list.innerHTML += ` 
        <li id='${change.doc.id}'>
        <input type="text" value="${change.doc.data().value}" disabled/>
        <button onclick="editTodo(this, '${change.doc.id}')">EDIT</button>
        <button onclick='dltTodo("${change.doc.id}")'>DELETE</button>
        </li>`
            }
        })
    });

}
getTodos()


async function addTodo() {
    var input = document.getElementById("input");
    try {
        const docRef = await addDoc(collection(db, "users"), {
            value: input.value
        });
    } catch (e) {
        console.error(e);
    }
    input.value = ""
}


async function dltTodo(id) {
    // console.log(id)
    await deleteDoc(doc(db, "users", id));
    console.log("todo Deleted")
    // event.target.parentNode.remove()
}
async function dltAll() {
    var list = document.getElementById("list")
    list.innerHTML = ""
    let arr = []
    for (var i = 0; i < ids.length; i++) {
        await deleteDoc(doc(db, "users", ids[i]));
        arr.push(await deleteDoc(doc(db, "users", ids[i])))
    }
    Promise.all(arr)
        .then((res) => {
            console.log("todo has been deleted")
        })
        .catch((err) => {
            console.log(err)
        })
}
var EDIT = false
async function editTodo(e, id) {
    if (EDIT) {
        await updateDoc(doc(db, "users", id), {
            value: e.parentNode.childNodes[1].value
        })

        e.parentNode.childNodes[1].disabled = true
        e.parentNode.childNodes[1].blur()
        e.parentNode.childNodes[3].innerHTML = "EDIT"
        EDIT = false
    } else {
        e.parentNode.childNodes[1].disabled = false
        e.parentNode.childNodes[1].focus()
        e.parentNode.childNodes[3].innerHTML = "UPDATE"
        EDIT = true
    }
}


window.addTodo = addTodo
window.editTodo = editTodo
window.dltTodo = dltTodo
window.dltAll = dltAll



