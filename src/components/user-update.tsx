import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { updateUser } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { User } from "@/lib/features/users/UsersSlice"

interface UpdateUserFormProps {
    user: User
    onSuccess: () => void
}

export function UpdateUserForm({ user, onSuccess }: UpdateUserFormProps) {
    const [formData, setFormData] = useState({
        name: user.name,
        username: user.username,
        status: user.status,
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload: any = {}
            if (formData.name !== user.name) payload.name = formData.name
            if (formData.username !== user.username) payload.username = formData.username
            if (formData.status !== user.status) payload.status = formData.status
            if (formData.password) payload.password = formData.password


            const result = await updateUser(user._id, payload)

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error
                })
                return
            }

            toast({
                title: "Success",
                description: result.message || "User updated successfully"
            })
            onSuccess()

        } catch (error) {
            console.error('Update error:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update user"
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                        value={formData.username}
                        onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                        value={user.role.name}
                        disabled
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto">Update User</Button>
        </form>
    )
}