import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock Card', href: '/stock/card' },
];

interface StockCard {
    id: number;
    productName: string;
    barcode: string;
    unit: string;
    status: boolean;
}

interface Props {
    stockCards: StockCard[];
}

export default function StockCardPage({ stockCards }: Props) {
    const [showPanel, setShowPanel] = useState(false);
    const [panelMode, setPanelMode] = useState<'create' | 'edit'>('create');
    const [selectedCard, setSelectedCard] = useState<StockCard | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        productName: "",
        barcode: "",
        unit: "ad",
        status: "1",
    });

    const openCreatePanel = () => {
        reset();
        setPanelMode('create');
        setSelectedCard(null);
        setShowPanel(true);
    };

    const openEditPanel = (card: StockCard) => {
        setPanelMode('edit');
        setSelectedCard(card);
        setData({
            productName: card.productName,
            barcode: card.barcode,
            unit: card.unit,
            status: card.status ? "1" : "0",
        });
        setShowPanel(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (panelMode === 'edit' && selectedCard) {
            put(`/stock/card/update/${selectedCard.id}`, {
                ...data,
                onSuccess: () => {
                    setShowPanel(false);
                    reset();
                    setPanelMode('create');
                    setSelectedCard(null);
                },
            });
        } else {
            post('/stock/card/store', {
                onSuccess: () => {
                    setShowPanel(false);
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Card" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="pl-8">
                        <h1 className="text-3xl font-extrabold text-gray-800">Stock Card</h1>
                        <p className="text-sm text-gray-500">Manage and track your stock items.</p>
                    </div>
                    <Button variant="default" className="gap-2" onClick={openCreatePanel}>
                        <Plus className="h-4 w-4" />
                        Create Stock Card
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Stock Cards</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stockCards.length === 0 ? (
                            <p className="text-sm text-gray-500">No stock cards yet.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {stockCards.map((s) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center justify-between border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex flex-col space-y-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{s.productName}</h3>
                                            <p className="text-gray-700 text-sm">
                                                <span className="font-semibold">Barcode:</span> {s.barcode}
                                            </p>
                                            <p className="text-gray-700 text-sm capitalize">
                                                <span className="font-semibold">Unit:</span> {s.unit}
                                            </p>
                                            <p className="text-gray-700 text-sm">
                                                <span className="font-semibold">Status:</span>{' '}
                                                <span className={s.status ? 'text-green-600' : 'text-red-600'}>
                                                    {s.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex space-x-3">
                                            <Button variant={'outline'} onClick={() => openEditPanel(s)}>
                                                <Edit className="h-5 w-5 text-yellow-600" />
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild={true}>
                                                    <Button variant={'outline'}>
                                                        <Trash2 className="h-5 w-5 text-red-600" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Are you sure you want to delete?</DialogTitle>
                                                        <DialogDescription>This action cannot be undone. Please make sure you are sure.</DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild={true}><Button variant={'outline'}>Cancel</Button></DialogClose>
                                                        <DialogClose asChild={true}>
                                                            <Link href={route('stock.card.destroy', s.id)} method={'delete'}>
                                                                <Button variant={'outline'} disabled={processing}>
                                                                    <Trash2 className="h-5 w-5 text-red-600" />
                                                                    {processing ? 'Deleting...' : 'Yes, delete'}
                                                                </Button>
                                                            </Link>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Overlay */}
                {showPanel && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowPanel(false)}
                    />
                )}

                {/* Slide-in Panel */}
                <div
                    className={`fixed top-0 right-0 z-50 h-full w-[400px] transform bg-white shadow-xl transition-transform duration-300 ${showPanel ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex items-center justify-between border-b p-4">
                        <h2 className="text-lg font-semibold">
                            {panelMode === 'edit' ? 'Edit Stock Card' : 'Create Stock Card'}
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setShowPanel(false);
                                reset();
                                setPanelMode('create');
                                setSelectedCard(null);
                            }}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 p-4">
                            <div className="space-y-2">
                                <Label>Product Name*</Label>
                                <Input
                                    placeholder="Product Name"
                                    value={data.productName}
                                    onChange={(e) => setData('productName', e.target.value)}
                                />
                                <InputError message={errors.productName} />
                            </div>
                            <div className="space-y-2">
                                <Label>Barcode*</Label>
                                <Input
                                    placeholder="Barcode"
                                    value={data.barcode}
                                    onChange={(e) => setData('barcode', e.target.value)}
                                />
                                <InputError message={errors.barcode} />
                            </div>
                            <div className="space-y-2">
                                <Label>Unit*</Label>
                                <Select
                                    value={data.unit}
                                    onValueChange={(value) => setData('unit', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ad">Piece</SelectItem>
                                        <SelectItem value="mt">Metre (mt)</SelectItem>
                                        <SelectItem value="lt">Litre (lt)</SelectItem>
                                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status*</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
