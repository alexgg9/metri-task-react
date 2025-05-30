<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function getTasksByProject(string $projectId)
    {
        try {
            \Log::info('Obteniendo tareas para proyecto:', ['project_id' => $projectId]);

            $tasks = Task::with('user')
                ->where('project_id', (int)$projectId)
                ->get();

            \Log::info('Tareas encontradas:', [
                'count' => $tasks->count(),
                'tasks' => $tasks->toArray()
            ]);

            return response()->json($tasks);
        } catch (\Exception $e) {
            \Log::error('Error al obtener tareas:', [
                'project_id' => $projectId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al obtener las tareas',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
