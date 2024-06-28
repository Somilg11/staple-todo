import React, { useRef, useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion } from 'framer-motion';
import { MdEdit } from "react-icons/md";

function Foreground() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const containerRef = useRef(null);
  const [constraints, setConstraints] = useState(null);

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);

    if (containerRef.current) {
      const containerBounds = containerRef.current.getBoundingClientRect();
      setConstraints({
        top: -containerBounds.top,
        left: -containerBounds.left,
        right: containerBounds.width - 240, // assuming card width is 240px
        bottom: containerBounds.height - 288 // assuming card height is 288px
      });
    }
  }, []);

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("tasks");
    }
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, isEditing: false, isComplete: false }]);
      setNewTask("");
    }
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  function toggleEditTask(index) {
    setTasks(tasks =>
      tasks.map((task, i) =>
        i === index ? { ...task, isEditing: !task.isEditing } : task
      )
    );
  }

  function handleEditChange(event, index) {
    const updatedText = event.target.value;
    setTasks(tasks =>
      tasks.map((task, i) =>
        i === index ? { ...task, text: updatedText } : task
      )
    );
  }

  function saveEditTask(index) {
    setTasks(tasks =>
      tasks.map((task, i) =>
        i === index ? { ...task, isEditing: false } : task
      )
    );
  }

  function toggleCompleteTask(index) {
    setTasks(tasks =>
      tasks.map((task, i) =>
        i === index ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {tasks.map((task, index) => (
        <motion.div
          key={index}
          drag
          whileDrag={{ scale: 1.1 }}
          dragElastic={0.2}
          dragConstraints={constraints}
          className='absolute top-0 left-0 w-60 h-72 rounded-[45px] bg-zinc-900/90 text-white px-8 py-10 overflow-hidden z-10'
        >
          <FaRegFileAlt />
          {task.isEditing ? (
            <input
              type="text"
              value={task.text}
              onChange={(e) => handleEditChange(e, index)}
              onBlur={() => saveEditTask(index)}
              className='text-sm leading-tight mt-5 font-semibold bg-zinc-900 text-white border-none outline-none w-full'
              autoFocus
            />
          ) : (
            <p className='text-sm leading-tight mt-5 font-semibold'>{task.text}</p>
          )}
          <div className="footer absolute bottom-0 w-full left-0">
            <div className='flex items-center justify-between px-8 py-3 mb-3'>
              <h5>
                <span className='w-7 h-7 bg-zinc-600 rounded-full flex items-center justify-center'>
                  <MdEdit className='cursor-pointer' onClick={() => toggleEditTask(index)} />
                </span>
              </h5>
              <span className='w-7 h-7 bg-zinc-600 rounded-full flex items-center justify-center' onClick={() => deleteTask(index)}>
                <IoClose className='cursor-pointer' />
              </span>
            </div>
            <div
              className={`tag w-full py-4 ${task.isComplete ? "bg-green-600" : "bg-blue-600"} flex items-center justify-center cursor-pointer`}
              onClick={() => toggleCompleteTask(index)}
            >
              <h3 className='text-sm font-semibold'>{task.isComplete ? "Completed" : "Mark as complete"}</h3>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="add">
        <input className="bg-zinc-900/90 text-white outline-none rounded-md absolute bottom-0 m-5 p-5 w-[90vw] z-20" type="text" placeholder="Enter a task... " value={newTask} onChange={handleInputChange} />

        <div className="fixed bottom-0 right-0 bg-zinc-900/90 h-16 w-16 rounded-full flex justify-center align-middle p-1 m-5 z-20" onClick={addTask}>
          <IoAdd size="3.2em" color="green" className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default Foreground;
