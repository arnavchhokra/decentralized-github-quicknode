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
    id:number,
    title: any;
    description: any;
    creatorAddress: any;
    link: any;
}

// Use props in the component
const RepoCard: React.FC<RepoCardProps> = ({ id,title, description, creatorAddress, link }) => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription><b>Description:</b> {description}{id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p> <b>InfoHash: </b>{creatorAddress}</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => { location.href = link; }}>Link</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RepoCard;