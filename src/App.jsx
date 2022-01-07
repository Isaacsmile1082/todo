import { useCallback, useEffect, useState } from 'react';

function App() {

  const [form, setForm] = useState({
    id: Date.now(),
    titleTask: '',
    time: 0,
    description: '',
  });

  const [todos, setTodos] = useState([]);

  const [update, setUpdate] = useState(false);


  const handleChange = (e) => setForm((state) => ({
    ...state,
    [e.target.name]: e.target.value
  }))

  const handleTime = useCallback(
    () => {
      setForm((state) => ({
        ...state,
        time: Number(state.time) + 1
      }))
    }, [])


  useEffect(() => {

    const todosLocal = [],
    keys = Object.keys(localStorage);
    let i = keys.length
    while (i--) {
      todosLocal.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    setTodos(todosLocal);

  }, []);

  const [isTimerStoped, setIsTimerStoped] = useState(true)

  const handleStopTimer = () => setIsTimerStoped(true)

  const handleBeginTimer = () => setIsTimerStoped(false)

  useEffect(() => {

    const intervalTime = setInterval(handleTime, 1000);

    isTimerStoped && clearInterval(intervalTime)

    return () => {
      clearInterval(intervalTime)
    }
  }, [isTimerStoped, handleTime])

  const resetForm = () => setForm({
    id: Date.now(),
    description: '',
    time: 0,
    titleTask: ''
  })

  const handleForm = (e) => {
    e.preventDefault();
    handleStopTimer();

    if (update) {
      const index = todos.findIndex((item) => item.id === form.id)
      const copyTodos = [...todos];
      copyTodos[index] = form;
      setTodos(copyTodos)
      setUpdate(false);
      localStorage.setItem(form.id, JSON.stringify(form))
      resetForm();
      return;
    }

    setTodos((state) => ([
      form,
      ...state,
    ]));

    localStorage.setItem(form.id, JSON.stringify(form));

    resetForm();
  }

  useEffect(() => {
    if (!update) {
      resetForm();
    }
  }, [update])

  const handleIsUpdate = (todo) => {
    setForm(todo)
    setUpdate(true)
  }
  const handleIsNotUpdate = () => {
    setUpdate(false)
    handleStopTimer();
  }

  const handleDeleteTodo = (id) => {
    const copyTodos = todos.filter(todo => todo.id !== id)
    setTodos(copyTodos)
    localStorage.removeItem(id);
    handleIsNotUpdate();
  }

  return (
    <div className="container pt-5">
      <h1>Todo App</h1>
      <form onSubmit={handleForm}>
        <div className='row pt-3 gy-3'>
          <div className="col">
            <label htmlFor="inputTitleTodo" className="form-label">Task</label>
            <input name='titleTask' onFocus={handleStopTimer} value={form.titleTask} onChange={handleChange} type="text" className="form-control" id="inputTitleTodo" />
          </div>
          <div>
            <label htmlFor="descriptionTextArea">Description of the task</label>
            <textarea className="form-control" name='description' value={form.description} onChange={handleChange} placeholder="Leave a description here" id="descriptionTextArea"></textarea>
          </div>
          <div className="col">
            <label htmlFor="inputTime" className="form-label">Time in seconds</label>
            <input name='time' value={form.time} onChange={handleChange} onFocus={handleStopTimer} onBlur={handleBeginTimer} type="number" className="form-control" id="inputTime" />
          </div>
          <div>
            <button type="submit" className={`btn ${!update ? 'btn-primary' : 'btn-secondary'}`}>{
              !update ? 'Submit to do' : 'Update to do'
            }</button>
            {
              update &&
              <button className='btn btn-danger ms-3' onClick={handleIsNotUpdate}>Cancel</button>
            }
          </div>
        </div>
      </form>
      <div className='row gx-3 gy-3 mt-3'>
        {todos?.map(({ titleTask, time, description, id }) => (
          <div className='col-6' key={id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-2">{titleTask}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Time: {time}</h6>
                <p className="card-text">{description}</p>
                <button className='btn btn-warning' onClick={() => handleIsUpdate({ titleTask, time, description, id })}>Edit</button>
                <button className='btn btn-danger mx-3' onClick={() => {handleDeleteTodo(id) }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
