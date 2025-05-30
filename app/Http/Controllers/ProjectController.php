<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function getProjectTasks(Project $project)
    {
        try {
            \Log::info('Obteniendo tareas para proyecto:', [
                'project_id' => $project->id,
                'project_name' => $project->name
            ]);

            $this->authorize('viewAny', Project::class);

            $tasks = $project->tasks()->with('user')->get();

            \Log::info('Tareas encontradas:', [
                'count' => $tasks->count(),
                'tasks' => $tasks->toArray()
            ]);

            return response()->json($tasks);
        } catch (\Exception $e) {
            \Log::error('Error al obtener tareas del proyecto:', [
                'project_id' => $project->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al obtener las tareas del proyecto',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
