"use client";

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from './ui/button';

// Define props interface
interface RepoCardProps {
    title: string;
    description: string;
    creatorAddress: string;
    link: string;
}

// Use props in the component
const RepoCard: React.FC<RepoCardProps> = ({ title, description, creatorAddress, link }) => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{creatorAddress}</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => { location.href = link; }}>Link</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RepoCard;