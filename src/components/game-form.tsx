"use client"
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createGame } from '@/lib/actions';
import { generateSlug } from '@/lib/utils';

interface GameFormProps {
    availableCategories?: string[];
    availableTypes?: string[];
    order: number;
}

export function GameForm({ availableCategories = [], availableTypes = [], order = 0 }: GameFormProps) {
    const [open, setOpen] = useState(false);
    const [customType, setCustomType] = useState(false);
    const [customCategory, setCustomCategory] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const payoutInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url: '',
        type: 'NEW',
        customTypeValue: '',
        category: 'Slot',
        customCategoryValue: '',
        status: 'active',
        tag: '',
        slug: '',
        order: order,
        thumbnail: null as File | null,
        payout: null as File | null
    });

    const { toast } = useToast();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'type') {
                    formDataToSend.append(key, customType ? formData.customTypeValue : (value !== null ? value.toString() : ''));
                } else if (key === 'category') {
                    formDataToSend.append(key, customCategory ? formData.customCategoryValue : (value !== null ? value.toString() : ''));
                } else if (value !== null) {
                    formDataToSend.append(key, value instanceof File ? value : value.toString());
                }
            });

            const { message, error } = await createGame(formDataToSend);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error
                });
                return;
            }

            toast({
                title: "Success",
                description: message || "Game created successfully"
            });

            setFormData({
                name: '',
                description: '',
                url: '',
                type: 'NEW',
                customTypeValue: '',
                category: 'Slot',
                customCategoryValue: '',
                status: 'active',
                tag: '',
                slug: '',
                order: order,
                thumbnail: null,
                payout: null
            });

            // Reset file inputs
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (payoutInputRef.current) payoutInputRef.current.value = '';

            // Reset custom type and category selection
            setCustomType(false);
            setCustomCategory(false);


            setOpen(false);
            router.refresh();

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create game"
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Game</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto thin-scrollbar grid grid-rows-[auto,1fr,auto]">
                <DialogHeader>
                    <DialogTitle>Add New Game</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3 py-2">
                    <div>
                        <Input
                            placeholder="Name"
                            value={formData.name}
                            onChange={e => {
                                const name = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    name,
                                    slug: generateSlug(name) // Auto-generate slug from name
                                }));
                            }}
                            required
                        />
                    </div>

                    <div>
                        <Textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            required
                            className="h-20"
                        />
                    </div>
                    <div>
                        <Input
                            placeholder="Tag"
                            value={formData.tag}
                            onChange={e => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            placeholder="Slug"
                            value={formData.slug}
                            onChange={e => setFormData(prev => ({
                                ...prev,
                                slug: generateSlug(e.target.value)
                            }))}
                            required
                        />
                    </div>

                    <div>
                        <Input
                            placeholder="Order"
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

                    <div>
                        <Input
                            placeholder="URL"
                            type="url"
                            value={formData.url}
                            onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Type Section */}
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

                        {/* Category Section */}
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
                        <Label>Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                        >
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
                        <Label>Thumbnail</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors">
                            <Input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    thumbnail: e.target.files?.[0] || null
                                }))}
                                required
                                className="cursor-pointer"
                            />
                            <p className="text-sm text-muted-foreground mt-2">Upload game thumbnail image</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Payout JSON</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors">
                            <Input
                                type="file"
                                ref={payoutInputRef}
                                accept=".json"
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    payout: e.target.files?.[0] || null
                                }))}
                                required
                                className="cursor-pointer"
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
                                Creating Game...
                            </>
                        ) : (
                            'Create Game'
                        )}
                    </Button>                </form>
            </DialogContent>
        </Dialog>
    );
}