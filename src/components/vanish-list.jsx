"use client"
import { AnimatePresence, useAnimate, usePresence } from "framer-motion";
import { useFormState } from "react-dom";
import React, { useEffect, useState } from "react";
import { FiClock, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { getAllTasks, insertTodo, deleteRow, updateCheckbox, editText } from "@/app/action";
import { text } from "drizzle-orm/mysql-core";
import localforage from 'localforage';
import useOnlineStatus from "./useOnlineStatus";

const queueAction = async (action, data) => {
  let queue = await localforage.getItem('actionQueue') || [];
  queue.push({ action, data });
  await localforage.setItem('actionQueue', queue);
};

export const VanishList = () => {
  const [addState, addAction] = useFormState(editText, { message: "" });
  const [todos, setTodos] = useState( [] );

  useEffect(() => {

    async function fetchTasks() {
      try{
      const tasks = await getAllTasks();
      setTodos(tasks)
      }
      catch(err){
        console.error("err: ", err)
      }
    }
    fetchTasks();

  }, []);

  const handleCheck = async (id) => {
    
    setTodos((pv) =>
      pv.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
    // update checkbox

    try{
      await updateCheckbox(id)
    } catch(err){
      console.err("err: ", err)
      await queueAction('updateCheckbox')
    }

  };

  const handleEdit = async (id, text) => {
    
    setTodos((pv) =>
      pv.map((t) => (t.id === id ? { ...t, text: text } : t))
    );

    const formData = new FormData();
    formData.append("id", id);
    formData.append("text", text);

    // update checkbox
    try{
      await addAction(formData)
    } catch(err){
      console.err("err: ", err)
      await queueAction('editText', formData)
    }
    
  };

  const removeElement = async (id) => {
    //pendding
    try{
      await deleteRow(id);
    } catch(err){
      console.err("err: ", err)
      await queueAction('deleteRow')
    }
    
    setTodos((pv) => pv.filter((t) => t.id !== id));
  };

  return (
    <section
      className="min-h-screen bg-zinc-950 py-24"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%2318181b'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      <div className="mx-auto w-full max-w-xl px-4">
        <Header />
        <Todos
          removeElement={removeElement}
          todos={todos}
          handleCheck={handleCheck}
          handleEdit = {handleEdit}
        />
      </div>
      <Form todos={todos} setTodos={setTodos} />
    </section>
  );
};

const Header = () => {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-medium text-white">Good morning! ☀️</h1>
      <p className="text-zinc-400">Let&apos;s see what we&apos;ve got to do today.</p>
    </div>
  );
};

const Form = ({todos ,setTodos }) => {
  const [addState, addAction] = useFormState(insertTodo, { message: "" });
  const [visible, setVisible] = useState(false);

  const [time, setTime] = useState(15);
  const [text, setText] = useState("");
  const [unit, setUnit] = useState("mins");

  const handleSubmit = async () => {
    if (!text.length) {
      return;
    }

    setTodos((pv) => [
      {
        // id: todos.length +1,
        id: Math.max(...todos.map(todo => todo.id))+1,
        text,
        checked: false,
        time: `${time} ${unit}`,
      },
      ...pv,
    ]);
    
    setTime(15);
    setText("");
    setUnit("mins");

    const formData = new FormData();
  formData.append("text", text);
  formData.append("number", time);
  formData.append("unit", unit);

  
  // here we could do the pendding as u want it
  // Call the server-side action
  try{
    await addAction(formData);
    } catch(err){
      console.err("err: ", err)
      await queueAction('insertTodo')
    }
  
  // here we could do what should be done after pending, and catching errs if there is
  };

  return (
    <div className="fixed bottom-6 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
      <AnimatePresence>
        {visible && (
          <motion.form
            
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mb-6 w-full rounded border border-zinc-700 bg-zinc-900 p-3"
          >
            <textarea
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you need to do?"
              className="h-24 w-full resize-none rounded bg-zinc-900 p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <input
                  name="number"
                  type="number"
                  className="w-24 rounded bg-zinc-700 px-1.5 py-1 text-sm text-zinc-50 focus:outline-0"
                  value={time}
                  onChange={(e) => setTime(parseInt(e.target.value))}
                />
                <button
                  name="unit" //minute
                  type="button"
                  value={unit}
                  onClick={() => {setUnit("mins")
                  }}
                  className={`rounded px-1.5 py-1 text-xs ${unit === "mins" ? "bg-white text-zinc-950" : "bg-zinc-300/20 text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"}`}
                >
                  mins
                </button>
                <button
                  name="hrs"
                  type="button"
                  value={unit}
                  onClick={() => setUnit("hrs")}
                  className={`rounded px-1.5 py-1 text-xs ${unit === "hrs" ? "bg-white text-zinc-950" : "bg-zinc-300/20 text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-200"}`}
                >
                  hrs
                </button>
              </div>
              <button
                type="submit"
                className="rounded bg-indigo-600 px-1.5 py-1 text-xs text-indigo-50 transition-colors hover:bg-indigo-500"
              >
                Submit
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <button
        onClick={() => setVisible((pv) => !pv)}
        className="grid w-full place-content-center rounded-full border border-zinc-700 bg-zinc-900 py-3 text-lg text-white transition-colors hover:bg-zinc-800 active:bg-zinc-900"
      >
        <FiPlus
          className={`transition-transform ${visible ? "rotate-45" : "rotate-0"}`}
        />
      </button>
    </div>
  );
};

const Todos = ({ todos, handleCheck, removeElement, handleEdit }) => {
  return (
    <div className="w-full space-y-3">
      <AnimatePresence>
        {todos.map((t) => (
          <Todo
            handleCheck={handleCheck}
            removeElement={removeElement}
            handleEdit={handleEdit}
            id={t.id}
            key={t.id}
            checked={t.checked}
            time={t.time}
          >
            {t.text}
          </Todo>
        ))}
      </AnimatePresence>
    </div>
  );
};

const Todo = ({ removeElement, handleCheck, handleEdit ,id, children, checked, time }) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const [isFormVisible, setFormVisible] = useState(false);
  const [text, setText] = useState('')

  const handleButtonClick = (e) => {
    e.preventDefault()
    setFormVisible(!isFormVisible);
};

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        animate(
          "p",
          {
            color: checked ? "#6ee7b7" : "#fca5a5",
          },
          {
            ease: "easeIn",
            duration: 0.125,
          }
        );
        await animate(
          scope.current,
          {
            scale: 1.025,
          },
          {
            ease: "easeIn",
            duration: 0.125,
          }
        );

        await animate(
          scope.current,
          {
            opacity: 0,
            x: checked ? 24 : -24,
          },
          {
            delay: 0.75,
          }
        );
        safeToRemove();
      };

      exitAnimation();
    }
  }, [isPresent]);

  return (
    <motion.div
      ref={scope}
      layout
      className="relative flex w-full items-center gap-3 rounded border border-zinc-700 bg-zinc-900 p-3"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => handleCheck(id)}
        className="size-4 accent-indigo-400"
      />

      <p
        className={`text-white transition-colors ${checked && "text-zinc-400"}`}
      >
        {children}
      </p>
      <div className="ml-auto flex gap-[12px]">
        <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleEdit(id, text);
        }}
        className="flex justify-between w-full">
          <button 
          onClick={handleButtonClick}
          name="id" 
          value={id} className="text-white border-2 rounded-[3px] p-1">
            {isFormVisible ? 'cancel' : 'Edit task'}
          </button>
           {/* !!!!!! */}
          {isFormVisible && (
                      <div>
                      <label>
                          New task:
                          <textarea
                            name="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What is the new task?"
                            className="h-[44px] w-full resize-none rounded bg-zinc-900 p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
                          />
                      </label>
                      <button className="text-white border-2 rounded-[3px] p-1" type="submit" name="id" value={id}>Submit</button>
                      </div>
            )}
        </form>
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400">
          <FiClock />
          <span>{time}</span>
        </div>
        <button
          onClick={() => removeElement(id)}
          className="rounded bg-red-300/20 px-1.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
        >
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
};

const syncActions = async () => {
  console.log("!!!")
  let queue = await localforage.getItem('actionQueue') || [];
  if(queue.length >= 1){}
  else{
  for (let item of queue) {
    try {
      switch (item.action) {
        case 'insertTodo':
            console.log("insertTodo!!!")
            await insertTodo(item.data)
            break;
        case 'updateCheckbox':
          console.log("updateCheck box!!!")
          await updateCheckbox(item.data);
          break;
        case 'editText':
          console.log("editText")
          await editText(item.data);
          break;
        case 'deleteRow':
          console.log("delete row !!!")
          await deleteRow(item.data);
          break;
        // Add more cases as needed
      }
      // Remove successfully processed action from queue
      queue = queue.filter(q => q !== item);
      await localforage.setItem('actionQueue', queue);
    } catch (err) {
      console.error('Error syncing action:', err);
      break; // Exit loop if there's an error
    }
  }
}
};

// Call syncActions periodically or on network status change



setInterval(async () =>{
  await syncActions()
  }
  , 1 *5000); // Retry
