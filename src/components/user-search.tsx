'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRoles } from '@/lib/actions';
import { RolesResponse } from '@/lib/types';
import { debounce } from '@/lib/utils';


const searchableFields = [
    {
        label: 'Search',
        value: 'search', // Default search across all fields
        type: 'search'
    },
    {
        label: 'Username',
        value: 'username',
        type: 'search'
    },
    {
        label: 'Status',
        value: 'status',
        type: 'filter', // Direct filter field
        param: 'status' // URL parameter name
    },
    {
        label: 'Role',
        value: 'role.name',
        type: 'filter',
        param: 'username'  // Changed this to use 'name' as the parameter
    }
];

type UserSearchProps = {
    searchField?: string;
    search?: string;
};

export function UserSearch({ searchField = 'search', search = '' }: UserSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentField, setCurrentField] = useState(searchField);
    const [searchValue, setSearchValue] = useState(search);
    const [roles, setRoles] = useState<RolesResponse['data']>([]);
    const [selectedRole, setSelectedRole] = useState('all');
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);


    // Fetch roles on component mount
    useEffect(() => {
        const loadRoles = async () => {
            const response = await getRoles();
            if (response.data) {
                setRoles(response.data);
            }
        };
        loadRoles();
    }, []);

    // Update search disabled state
    useEffect(() => {
        if (currentField === 'role.name' && selectedRole === 'all') {
            setIsSearchDisabled(true);
            updateSearchParams({ role: '', [currentField]: '' }); // Clear query when role is all
        } else {
            setIsSearchDisabled(false);
        }
    }, [currentField, selectedRole]);


    // Function to update query parameters in the URL
    const updateSearchParams = useCallback(
        (updatedParams: Record<string, string>) => {
            const params = new URLSearchParams(searchParams);

            // Update or remove query parameters
            Object.entries(updatedParams).forEach(([key, value]) => {
                if (value.trim()) {
                    params.set(key, value.trim());
                } else {
                    params.delete(key);
                }
            });

            router.push(`?${params.toString()}`);
        },
        [router, searchParams]
    );

    // Debounced function for updating URL parameters
    const debouncedUpdateSearchParams = useCallback(
        debounce((updatedParams: Record<string, string>) => {
            updateSearchParams(updatedParams);
        }, 300),
        [updateSearchParams]
    );


    // Handle input change (local state updates immediately, URL updates are debounced)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        const field = searchableFields.find(f => f.value === currentField);
        const paramName = field?.param || currentField;

        const updatedParams: Record<string, string> = {};

        if (selectedRole !== 'all') {
            updatedParams.role = selectedRole;
        }

        updatedParams[paramName] = value;

        debouncedUpdateSearchParams(updatedParams);
    };

    // Handle field change (resets input and role when field changes)
    const handleFieldChange = (field: string) => {
        setCurrentField(field);
        setSearchValue(''); // Clear the input when switching fields
        if (field !== 'role.name') {
            setSelectedRole('all'); // Reset role selection when not on Role
        }

        updateSearchParams({ [field]: '', role: '' });
    };


    // Handle role change (updates role in URL and clears query if role is all)
    const handleRoleChange = (value: string) => {
        setSelectedRole(value);

        const field = searchableFields.find(f => f.value === currentField);
        const paramName = field?.param || currentField;

        const updatedParams: Record<string, string> = {};

        if (value !== 'all') {
            updatedParams.role = value;
        } else {
            // Clear the query when role is set to "all"
            updatedParams.role = '';
            updatedParams[paramName] = '';
        }

        updateSearchParams(updatedParams);
    };

    // Sync `searchValue` with query params whenever URL changes
    useEffect(() => {
        const field = searchableFields.find(f => f.value === currentField)?.param || currentField;
        const paramValue = searchParams.get(field) || '';
        if (paramValue !== searchValue) {
            setSearchValue(paramValue);
        }
    }, [searchParams, currentField]);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Select field dropdown */}
            <Select
                value={currentField}
                onValueChange={(value) => handleFieldChange(value)}
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                    {searchableFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                            {field.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Input box for search */}
            {currentField === 'role.name' && (
                <Select
                    value={selectedRole}
                    onValueChange={(value) => handleRoleChange(value)}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map((role) => (
                            <SelectItem key={role.name} value={role.name}>
                                {role.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Role selection dropdown */}
            <Input
                placeholder={`Search by ${searchableFields.find((f) => f.value === currentField)?.label.toLowerCase()}...`}
                value={searchValue}
                onChange={handleInputChange}
                className="w-full sm:max-w-sm"
                disabled={isSearchDisabled} // Disable input if search is not allowed
            />
        </div>
    );
}