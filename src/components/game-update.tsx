import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useRef } from "react"
import { updateGame } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Game } from "@/lib/types"

interface UpdateGameFormProps {
    game: Game
    availableCategories?: string[]
    availableTypes?: string[]
    onSuccess: () => void
}

export function UpdateGameForm({ game, availableCategories = [], availableTypes = [], onSuccess }: UpdateGameFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customType, setCustomType] = useState(false);
    const [customCategory, setCustomCategory] = useState(false);

    const [formData, setFormData] = useState({
        name: game.name,
        description: game.description,
        url: game.url,
        type: game.type,
        customTypeValue: '',
        category: game.category,
        customCategoryValue: '',
        status: game.status,
        tag: game.tag,
        slug: game.slug,
        order: game.order,
        thumbnail: null as File | null,
        payout: null as File | null
    });

    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const payoutInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData()

            // Handle custom type and category
            if (customType) {
                formDataToSend.append('type', formData.customTypeValue);
            } else if (formData.type !== game.type) {
                formDataToSend.append('type', formData.type);
            }

            if (customCategory) {
                formDataToSend.append('category', formData.customCategoryValue);
            } else if (formData.category !== game.category) {
                formDataToSend.append('category', formData.category);
            }


            // Only append changed fields
            if (formData.name !== game.name) formDataToSend.append('name', formData.name)
            if (formData.description !== game.description) formDataToSend.append('description', formData.description)
            if (formData.url !== game.url) formDataToSend.append('url', formData.url)
            if (formData.status !== game.status) formDataToSend.append('status', formData.status)
            if (formData.tag !== game.tag) formDataToSend.append('tag', formData.tag)
            if (formData.slug !== game.slug) formDataToSend.append('slug', formData.slug)
            if (formData.order !== game.order) formDataToSend.append('order', formData.order.toString())
            if (formData.thumbnail) formDataToSend.append('thumbnail', formData.thumbnail)
            if (formData.payout) formDataToSend.append('payout', formData.payout)

            const result = await updateGame(game._id, formDataToSend)

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
                description: "Game updated successfully"
            })
            onSuccess()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update game"
            });
        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Name</Label>
                <Input
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    className="h-20"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Type</Label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            {customType ? (
                                <Input
                                    placeholder="Enter custom type"
                                    value={formData.customTypeValue}
                                    onChange={e => setFormData(prev => ({ ...prev, customTypeValue: e.target.value }))}
                                    required
                                />
                            ) : (
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant={customType ? "secondary" : "ghost"}
                            onClick={() => setCustomType(!customType)}
                            size="sm"
                        >
                            {customType ? "Existing" : "Custom"}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            {customCategory ? (
                                <Input
                                    placeholder="Enter custom category"
                                    value={formData.customCategoryValue}
                                    onChange={e => setFormData(prev => ({ ...prev, customCategoryValue: e.target.value }))}
                                    required
                                />
                            ) : (
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCategories.map(category => (
                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant={customCategory ? "secondary" : "ghost"}
                            onClick={() => setCustomCategory(!customCategory)}
                            size="sm"
                        >
                            {customCategory ? "Existing" : "Custom"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>URL</Label>
                <Input
                    type="url"
                    value={formData.url}
                    onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Tag</Label>
                <Input
                    value={formData.tag}
                    onChange={e => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Order</Label>
                <Input
                    type="number"
                    value={formData.order.toString()} // Ensure value is always a string
                    onChange={e => {
                        const value = e.target.value;
                        setFormData(prev => ({
                            ...prev,
                            order: value === "" ? 0 : parseInt(value) || 0 // Default to 0 when empty
                        }));
                    }}
                    required
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
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>New Thumbnail</Label>
                <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <Input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={e => setFormData(prev => ({
                            ...prev,
                            thumbnail: e.target.files?.[0] || null
                        }))}
                    />
                    <p className="text-sm text-muted-foreground mt-2">Upload game thumbnail image</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label>New Payout JSON</Label>
                <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <Input
                        type="file"
                        ref={payoutInputRef}
                        accept=".json"
                        onChange={e => setFormData(prev => ({
                            ...prev,
                            payout: e.target.files?.[0] || null
                        }))}
                    />
                    <p className="text-sm text-muted-foreground mt-2">Upload payout configuration file</p>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Game...
                    </>
                ) : (
                    'Update Game'
                )}
            </Button>
        </form>
    )
}