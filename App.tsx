import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase'; // Ensure this is only declared once
import { Auth } from './components/Auth';
import { FileVault } from './components/FileVault';

interface Todo {
  id: number; // Adjust type based on your database schema
  task: string; // Adjust type based on your database schema
}

function Page() {
  const [todos, setTodos] = useState<Todo[]>([]); // Define the type for todos

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select();

      if (error) {
        console.error('Error fetching todos:', error);
      } else if (data && data.length > 0) {
        setTodos(data);
      }
    }

    getTodos();
  }, []);

  return (
    <div>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.task}</li>
      ))}
    </div>
  );
}

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {!session ? <Auth /> : <FileVault />}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App; // Only one default export
