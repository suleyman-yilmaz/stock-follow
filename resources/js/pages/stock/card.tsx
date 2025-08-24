import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Plus, X, Edit, Trash2, Settings2, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';

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
    const [searchCardName, setSearchCardName] = useState('');
    const [searchBarcode, setSearchBarcode] = useState('');
    const [filterUnit, setFilterUnit] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

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
            put(`/stock-card/update/${selectedCard.id}`, {
                ...data,
                onSuccess: () => {
                    setShowPanel(false);
                    reset();
                    setPanelMode('create');
                    setSelectedCard(null);
                },
            });
        } else {
            post('/stock-card/store', {
                onSuccess: () => {
                    setShowPanel(false);
                    reset();
                },
            });
        }
    };

    const handleSearchCardName = (value: string) => {
        setSearchCardName(value);
        const v = value.trim();
        router.get('/stock-card', v ? { barcode:searchBarcode, cardName: v, unit: filterUnit, status: filterStatus } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchBarcode = (value: string) => {
        setSearchBarcode(value);
        const v = value.trim();
        router.get('/stock-card', v ? { barcode: v, cardName: searchCardName, unit: filterUnit, status: filterStatus } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterUnit = (value: 'ad' | 'mt' | 'lt' | 'kg') => {
        setFilterUnit(value);
        const v = value.trim();
        router.get('/stock-card', v ? { barcode: searchBarcode, cardName: searchCardName, unit: v, status: filterStatus } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterStatus = (value: '1' | '0') => {
        setFilterStatus(value);
        const v = value.trim();
        router.get('/stock-card', v ? { barcode: searchBarcode, cardName: searchCardName, unit: filterUnit, status: v } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const { props } = usePage<{
        flash?: { success?: string; error?: string };
    }>();

    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.error) {
            toast.error(props.flash.error);
            setShowPanel(false);
        }
    }, [props.flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Card" />
            <Toaster position={'top-right'} richColors={true} expand={true} duration={4000}></Toaster>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="pl-8">
                        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Stock Card</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-600">Manage and track your stock items.</p>
                    </div>
                    <Button variant="default" className="gap-2" onClick={openCreatePanel}>
                        <Plus className="h-4 w-4" />
                        Create Stock Card
                    </Button>
                </div>

                <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                                    <Settings2 className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Filters</CardTitle>
                            </div>
                            <Link href={'/stock-card'}>
                                <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                    <RotateCcw className="h-4 w-4" />
                                    Reset
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-2">
                        <div className="rounded-2xl bg-muted/40 p-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Search */}

                                <div className="space-y-1.5">
                                    <Label htmlFor="search" className="text-[13px] text-muted-foreground">
                                        Search by name
                                    </Label>
                                    <Input
                                        id="search"
                                        placeholder="Type product name..."
                                        className="h-10 rounded-xl border-muted-foreground/20 focus-visible:ring-2"
                                        type={'text'}
                                        value={searchCardName}
                                        onChange={(e) => handleSearchCardName(e.target.value)}
                                    />
                                </div>

                                {/* Movement Type */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="search" className="text-[13px] text-muted-foreground">
                                        Search by barcode
                                    </Label>
                                    <Input
                                        id="search"
                                        placeholder="Type barcode..."
                                        className="h-10 rounded-xl border-muted-foreground/20 focus-visible:ring-2"
                                        type={'text'}
                                        value={searchBarcode}
                                        onChange={(e) => handleSearchBarcode(e.target.value)}
                                    />
                                </div>

                                {/* Unit */}
                                <div className="space-y-1.5">
                                    <Label className="text-[13px] text-muted-foreground">Unit</Label>
                                    <Select value={filterUnit} onValueChange={handleFilterUnit}>
                                        <SelectTrigger className="h-10 rounded-xl border-muted-foreground/20 focus:ring-0 focus-visible:ring-2">
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ad">Piece (ad)</SelectItem>
                                            <SelectItem value="mt">Metre (mt)</SelectItem>
                                            <SelectItem value="lt">Litre (lt)</SelectItem>
                                            <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[13px] text-muted-foreground">Status</Label>
                                    <Select value={filterStatus} onValueChange={handleFilterStatus}>
                                        <SelectTrigger className="h-10 rounded-xl border-muted-foreground/20 focus:ring-0 focus-visible:ring-2">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Active</SelectItem>
                                            <SelectItem value="0">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="dark:text-gray-100">Stock Cards</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stockCards.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No stock cards yet.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {stockCards.map((s) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow"
                                    >
                                        <div className="flex flex-col space-y-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{s.productName}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">Barcode:</span>{' '}
                                                <span className="text-gray-700 dark:text-blue-300 font-mono">{s.barcode}</span>
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm capitalize">
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">Unit:</span>{' '}
                                                <span className="text-gray-700 dark:text-purple-300">{s.unit}</span>
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">Status:</span>{' '}
                                                <span className={s.status
                                                    ? 'text-green-600 dark:text-green-400 font-medium'
                                                    : 'text-red-600 dark:text-red-400 font-medium'
                                                }>
                                                    {s.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex space-x-3">
                                            <Button
                                                variant={'outline'}
                                                onClick={() => openEditPanel(s)}
                                                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <Edit className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild={true}>
                                                    <Button
                                                        variant={'outline'}
                                                        className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >
                                                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                                                    <DialogHeader>
                                                        <DialogTitle className="dark:text-white">Are you sure you want to delete?</DialogTitle>
                                                        <DialogDescription className="dark:text-gray-300">
                                                            This action cannot be undone. Please make sure you are sure.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild={true}>
                                                            <Button
                                                                variant={'outline'}
                                                                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>
                                                        <DialogClose asChild={true}>
                                                            <Link href={route('stock.card.destroy', s.id)} method={'delete'}>
                                                                <Button
                                                                    variant={'outline'}
                                                                    disabled={processing}
                                                                    className="border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                                                >
                                                                    <Trash2 className="h-5 w-5 mr-2" />
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
                    className={`dark:bg-gray-700 fixed top-0 right-0 z-50 h-full w-[400px] transform bg-white shadow-xl transition-transform duration-300 ${showPanel ? 'translate-x-0' : 'translate-x-full'
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
