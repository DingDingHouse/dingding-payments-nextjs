'use client';

import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Role } from '@/lib/types';
import { Card } from './ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { Button } from './ui/button';
import { useDroppable } from '@dnd-kit/core';


function SortableRole({ role }: { role: Role }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: role._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="p-4 cursor-move">
                <h3 className="font-medium capitalize">{role.name}</h3>
                <p className="text-sm text-muted-foreground">Status: {role.status}</p>
            </Card>
        </div>
    );
}

function DroppableArea({ title, children }: { title: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
        id: title,
    });

    return (
        <div
            ref={setNodeRef}
            className={`p-4 rounded-lg border-2 ${isOver ? 'border-primary bg-primary/5' : 'border-dashed border-muted'
                }`}
        >
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    );
}

export function RoleDragAndDrop({
    currentRole,
    availableRoles,
    onUpdateDescendants
}: {
    currentRole: Role;
    availableRoles: Role[];
    onUpdateDescendants: (roleIds: string[], operation: 'add' | 'remove') => void;
}) {
    const [pendingChanges, setPendingChanges] = useState<{ roleId: string, operation: 'add' | 'remove' }[]>([]);
    const [descendants, setDescendants] = useState<Role[]>(currentRole.descendants || []);

    const filteredAvailableRoles = availableRoles.filter(role =>
        role._id !== currentRole._id &&
        !descendants.some(desc => desc._id === role._id)
    );


    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const roleId = active.id as string;

            // Check if role exists in pending changes
            const existingChangeIndex = pendingChanges.findIndex(change => change.roleId === roleId);

            if (existingChangeIndex !== -1) {
                // Remove the pending change if it exists
                setPendingChanges(prev => prev.filter((_, i) => i !== existingChangeIndex));
            } else {
                // If dragging from available to descendants
                if (filteredAvailableRoles.some(r => r._id === roleId)) {
                    const role = availableRoles.find(r => r._id === roleId);
                    if (role) {
                        setDescendants(prev => [...prev, {
                            _id: role._id,
                            name: role.name,
                            status: role.status
                        }]);
                        setPendingChanges(prev => [...prev, { roleId, operation: 'add' }]);
                    }
                }
                // If dragging from descendants to available
                else if (descendants.some(d => d._id === roleId)) {
                    setDescendants(prev => prev.filter(d => d._id !== roleId));
                    setPendingChanges(prev => [...prev, { roleId, operation: 'remove' }]);
                }
            }
        }
    }


    function handleSaveChanges() {
        // Group by operation
        const adds = pendingChanges.filter(c => c.operation === 'add').map(c => c.roleId);
        const removes = pendingChanges.filter(c => c.operation === 'remove').map(c => c.roleId);

        // Call API for each operation type
        if (adds.length) onUpdateDescendants(adds, 'add');
        if (removes.length) onUpdateDescendants(removes, 'remove');

        setPendingChanges([]);
    }

    function handleDiscardChanges() {
        setDescendants(currentRole.descendants as Role[]);
        setPendingChanges([]);
    }

    return (
        <div className="space-y-4">
            {pendingChanges.length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handleDiscardChanges}>
                            Discard Changes
                        </Button>
                        <Button onClick={handleSaveChanges}>
                            Save Changes ({pendingChanges.length})
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                    <DroppableArea title="Available Roles">
                        <SortableContext items={filteredAvailableRoles.map(r => r._id)}>
                            <div className="space-y-2">
                                {filteredAvailableRoles.map(role => (
                                    <SortableRole key={role._id} role={role} />
                                ))}
                            </div>
                        </SortableContext>
                    </DroppableArea>

                    <DroppableArea title="Current Descendants">
                        <SortableContext items={descendants.map(d => d._id)}>
                            <div className="space-y-2">
                                {descendants.map(descendant => (
                                    <SortableRole key={descendant._id} role={descendant} />
                                ))}
                            </div>
                        </SortableContext>
                    </DroppableArea>
                </DndContext>
            </div>
        </div>
    );
}