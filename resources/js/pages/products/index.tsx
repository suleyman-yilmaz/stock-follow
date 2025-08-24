import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, RotateCcw, Settings2, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/products' },
];

interface StockCard {
    id: number;
    productName: string;
}

interface Products {
    id: number;
    stock_card_id: number;
    card: {
        id: number;
        productName: string;
        barcode: string;
        unit: string;
    };
    movement_type: string;
    movement_amount: number;
    movement_price: number;
    total_price: number;
    movement_date: string;
    company: string;
}

interface Props {
    stock_cards: StockCard[];
    products: Products[];
}

export default function ProductsIndexPage({ stock_cards, products }: Props) {
    const [showPanel, setShowPanel] = useState(false);
    const [lockStockCard, setLockStockCard] = useState(false);
    const [panelMode, setPanelMode] = useState<'create' | 'edit'>('create');
    const [selectedCard, setSelectedCard] = useState<Products | null>(null);
    const [searchProductName, setSearchProductName] = useState('');
    const [filterMovementType, setFilterMovementType] = useState('');
    const [filterUnit, setFilterUnit] = useState('');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        stock_card_id: '',
        movement_type: '',
        movement_amount: '',
        movement_price: '',
        total_price: '',
        movement_date: '',
        company: '',
    });

    const openCreatePanel = () => {
        reset();
        setPanelMode('create');
        setSelectedCard(null);
        setShowPanel(true);
        setLockStockCard(false);
    };

    const openEditPanel = (card: Products) => {
        setLockStockCard(true);
        setPanelMode('edit');
        setSelectedCard(card);
        setData({
            stock_card_id: String(card.stock_card_id),
            movement_type: card.movement_type,
            movement_amount: String(card.movement_amount),
            movement_price: String(card.movement_price),
            total_price: String(card.total_price),
            movement_date: card.movement_date,
            company: card.company,
        });
        setShowPanel(true);
    };

    const handleChange = (field: 'movement_amount' | 'movement_price', value: string) => {
        setData(field, value);

        const amount = field === 'movement_amount' ? parseFloat(value) || 0 : parseFloat(data.movement_amount) || 0;
        const price = field === 'movement_price' ? parseFloat(value) || 0 : parseFloat(data.movement_price) || 0;
        const total = amount * price;
        setData('total_price', Number.isFinite(total) ? total.toString() : '0');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (panelMode === 'edit' && selectedCard) {
            put(`/products/update/${selectedCard.id}`, {
                ...data,
                onSuccess: () => {
                    setShowPanel(false);
                    reset();
                    setPanelMode('create');
                    setSelectedCard(null);
                },
            });
        } else {
            post('/products/store', {
                onSuccess: () => {
                    setShowPanel(false);
                    reset();
                },
            });
        }
    };

    const handleSearchProductName = (value: string) => {
        setSearchProductName(value);
        const v = value.trim();
        router.get('/products', v ? { productName: v, movementType: filterMovementType, unit: filterUnit } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterMovementType = (value: 'all' | 'in' | 'out') => {
        setFilterMovementType(value);
        const v = value.trim();
        router.get('/products', v ? { productName: searchProductName, movementType: v, unit: filterUnit } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterUnit = (value: 'ad' | 'mt' | 'lt' | 'kg') => {
        setFilterUnit(value);
        const v = value.trim();
        router.get('/products', v ? { productName: searchProductName, movementType: filterMovementType, unit: v } : {}, {
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
            <Head title="Products" />
            <Toaster position={'top-right'} richColors={true} expand={true} duration={4000}></Toaster>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="pl-8">
                        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Products</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-600">Manage and track your products.</p>
                    </div>
                    <Button variant="default" className="gap-2" onClick={openCreatePanel}>
                        <Plus className="h-4 w-4" />
                        Create Product
                    </Button>
                </div>

                {/* FİLTRE KARTI (statik) */}
                <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                                    <Settings2 className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Filters</CardTitle>
                            </div>
                            <Link href={'/products'}>
                                <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                    <RotateCcw className="h-4 w-4" />
                                    Reset
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-2">
                        <div className="rounded-2xl bg-muted/40 p-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                                        value={searchProductName}
                                        onChange={(e) => handleSearchProductName(e.target.value)}
                                    />
                                </div>

                                {/* Movement Type */}
                                <div className="space-y-1.5">
                                    <Label className="text-[13px] text-muted-foreground">Movement Type</Label>
                                    <Select value={filterMovementType} onValueChange={handleFilterMovementType}>
                                        <SelectTrigger className="h-10 rounded-xl border-muted-foreground/20 focus:ring-0 focus-visible:ring-2">
                                            <SelectValue placeholder="Select movement type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={'all'}>All</SelectItem>
                                            <SelectItem value={'in'}>In</SelectItem>
                                            <SelectItem value={'out'}>Out</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid auto-rows-[1fr] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((p) => (
                                <Card className="flex flex-col">
                                    <CardHeader className="py-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="line-clamp-1 text-base">{p.card.productName}</CardTitle>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    p.movement_type === 'in' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                } `}
                                            >
                                                {p.movement_type === 'in' ? 'IN' : 'OUT'}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            Barcode: {p.card.barcode} | Unit: {p.card.unit}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 px-4 pb-2 text-sm">
                                        <div className="mb-2 grid grid-cols-3 gap-2">
                                            <div>
                                                Qty: <span className="font-medium">{p.movement_amount}</span>
                                            </div>
                                            <div>
                                                Price: <span className="font-medium">{p.movement_price}</span>
                                            </div>
                                            <div>
                                                Total: <span className="font-semibold">{p.total_price}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Date: {p.movement_date}</span>
                                            <span className="max-w-[50%] truncate">Company: {p.company}</span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex items-center justify-between border-t px-4 py-2 text-xs">
                                        <span className="text-muted-foreground">ID: {p.id}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-yellow-600 hover:text-yellow-700"
                                                onClick={() => openEditPanel(p)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>

                                            <Dialog>
                                                <DialogTrigger asChild={true}>
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Are you sure you want to delete the product?</DialogTitle>
                                                        <DialogDescription>
                                                            This action cannot be undone. Please make sure you are sure.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild={true}>
                                                            <Button variant={'outline'}>Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild={true}>
                                                            <Link href={route('stock.movement.destroy', p.id)} method={'delete'}>
                                                                <Button variant={'destructive'}>Yes, delete</Button>
                                                            </Link>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {showPanel && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowPanel(false)} />}

                <div
                    className={`fixed top-0 right-0 z-50 h-full w-[400px] transform bg-white shadow-xl transition-transform duration-300 dark:bg-gray-700 ${
                        showPanel ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between border-b p-4">
                        <h2 className="text-lg font-semibold">{panelMode === 'edit' ? 'Edit Product' : 'Create Product'}</h2>
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
                                <Label>Product*</Label>
                                <Select
                                    value={data.stock_card_id}
                                    onValueChange={(v) => (!lockStockCard ? setData('stock_card_id', v) : null)}
                                    disabled={lockStockCard}
                                >
                                    <SelectTrigger className={lockStockCard ? 'cursor-not-allowed opacity-60' : ''}>
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    <SelectContent id={'stock_card_id'}>
                                        {stock_cards.map((card) => (
                                            <SelectItem key={card.id} value={String(card.id)}>
                                                {card.productName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.stock_card_id} />
                            </div>
                            <div className="space-y-2">
                                <Label>Movement Type*</Label>
                                <Select value={data.movement_type} onValueChange={(value) => setData('movement_type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Movement Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in">In</SelectItem>
                                        <SelectItem value="out">Out</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.movement_type} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={'movement_amount'}>Movement Amount*</Label>
                                <Input
                                    id={'movement_amount'}
                                    type={'number'}
                                    value={data.movement_amount}
                                    onChange={(e) => handleChange('movement_amount', e.target.value)}
                                    placeholder={'Enter Movement Amount'}
                                ></Input>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={'movement_price'}>Movement Price*</Label>
                                <Input
                                    id={'movement_price'}
                                    type={'number'}
                                    value={data.movement_price}
                                    onChange={(e) => handleChange('movement_price', e.target.value)}
                                    placeholder={'Enter Movement Price'}
                                ></Input>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={'total_price'}>Total Price*</Label>
                                <Input
                                    id={'total_price'}
                                    type={'number'}
                                    value={data.total_price}
                                    onChange={(e) => setData('total_price', e.target.value)}
                                    placeholder={'Total Price'}
                                    disabled={true}
                                ></Input>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={'movement_date'}>Movement Date*</Label>
                                <Input
                                    id={'movement_date'}
                                    type={'date'}
                                    value={data.movement_date}
                                    onChange={(e) => setData('movement_date', e.target.value)}
                                    placeholder={'Enter Movement Date'}
                                ></Input>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={'company'}>Company</Label>
                                <Input
                                    id={'company'}
                                    type={'text'}
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    placeholder={'Enter Company'}
                                ></Input>
                            </div>
                            <div className="flex justify-end pt-4">
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
