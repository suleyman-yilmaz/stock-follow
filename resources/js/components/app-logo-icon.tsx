type appLogoIconProps = {
    className?: string;
};
export default function AppLogoIcon({className=''}: appLogoIconProps) {
    return (
        <img src={'/favicon.ico'} alt={'Stock Follow'} className={`h-8 w-8 ${className}`}/>
    );
}
