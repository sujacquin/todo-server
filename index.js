const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
    desc: String,
    status: String
})


const app = express();
app.use(bodyParser.json());

app.use(cors());

mongoose.connect(
    "mongodb://localhost/todo-list",
    { useNewUrlParser: true }
);




app.post("/create", async (req, res) => {
    try {

        const existingTask = await Task.findOne({ desc: req.body.desc });

        if (existingTask === null) {
            const newTask = new Task({
                desc: req.body.desc,
                status: "new"
            });

            await newTask.save();
            res.json({ message: "Task created" });
        } else {
            res.status(400).json({
                error: {
                    message: "Task already exists"
                }
            });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.post("/update", async (req, res) => {
    try {
        if (req.body.id) {
            const task = await Task.findOne({ _id: req.body.id });

            if (task.status === "new") {
                task.status = "done";
            } else {
                task.status = "new";
            }

            await task.save();
            res.json({ message: "Updated" });
        } else {
            res.status(400).json({ message: "Missing parameter" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// **Delete**
app.post("/delete", async (req, res) => {
    try {
        if (req.body.id) {
            const task = await Task.findOne({ _id: req.body.id });
            // Autre manière de trouver un document à partir d'un `id` :
            // const student = await Student.findById(req.body.id);
            await task.remove();
            res.json({ message: "Removed" });
        } else {
            res.status(400).json({ message: "Missing id" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.listen(3000);