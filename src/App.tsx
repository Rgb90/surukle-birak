import React, { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Form } from "react-bootstrap";

type Todo = {
  id: string;
  content: string;
};

const grid = 8;

const reorder = (list: Todo[], startIndex: number, endIndex: number): Todo[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const TodoItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: #BCBCCF;
  padding: ${grid}px;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 32px;
  width: 100%; /* Tam genişlik */
  max-width: 600px; /* Maksimum genişlik */
  margin: 0 auto; /* Ortalamak için */
`;

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%; /* Formun ve butonun tamamını kapsaması için */
  max-width: 600px; /* Maksimum genişlik */
`;

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #3C3C68;
  margin: 0; /* Başlığın üst ve alt marginini sıfırlar */
`;

const Btn = styled.button`
  background: #3C3C68;
  border-radius: 5px;
  border: none;
  color: white;
  padding: 7px 20px;
  cursor: pointer;
`;

const StyledFormControl = styled(Form.Control)`
  height: 25px; /* Yüksekliği ayarlar */
  resize: none; /* Kullanıcının boyutu değiştirmesini engeller */
`;

const TodoListWrapper = styled.div`
  display: block; /* Listeyi alt alta sıralamak için */
  margin: 0 auto; /* Listeyi ortalamak için */
  text-align: center; /* Listeyi ortalamak için */
  border; radius;
`;

const Todo = ({ todo, index, onDelete }: { todo: Todo; index: number; onDelete: (id: string) => void }) => (
  <Draggable draggableId={todo.id} index={index}>
    {(provided) => (
      <TodoItem
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => onDelete(todo.id)}
      >
        {todo.content}
      </TodoItem>
    )}
  </Draggable>
);

const TodoList = React.memo(({ todos, onDelete }: { todos: Todo[]; onDelete: (id: string) => void }) => (
  <Droppable droppableId="list">
    {(provided) => (
      <TodoListWrapper ref={provided.innerRef} {...provided.droppableProps}>
        {todos.map((todo, index) => (
          <Todo todo={todo} index={index} key={todo.id} onDelete={onDelete} />
        ))}
        {provided.placeholder}
      </TodoListWrapper>
    )}
  </Droppable>
));

function App() {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = () => {
    if (todoInput.trim() === "") {
      alert("Boş hedef ekleyemezsiniz");
    } else if (todos.some((todo) => todo.content === todoInput)) {
      alert("Listede zaten var");
    } else {
      setTodos([...todos, { id: `id-${todos.length}`, content: todoInput }]);
      setTodoInput("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedTodos = reorder(
      todos,
      result.source.index,
      result.destination.index
    );

    setTodos(reorderedTodos);
  };

  const handleDelete = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <>
      <Wrapper>
        <Title>2024 Yılı Hedeflerim</Title>
        <Form onSubmit={handleSubmit}>
          <FormWrapper>
            <StyledFormControl
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              type="text"
            />
            <Btn type="submit">Ekle</Btn> {/* <Btn onClick={addTodo}>Ekle</Btn> böyle de olur */}
          </FormWrapper>
        </Form>
        <DragDropContext onDragEnd={onDragEnd}>
          <TodoList todos={todos} onDelete={handleDelete} />
        </DragDropContext>
      </Wrapper>
    </>
  );
}

export default App;
