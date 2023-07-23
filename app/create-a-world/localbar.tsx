import NavBar from '@/components/ui/navbar/NavBar';

export function LocalNavBar() {
    const PageTitleNavBarComponent = () => {
        // Some logic here...
        return (
            <div>Page Title</div>
        )
    }

    const LocalNavBarComponent = () => {
        // Some logic here...
        return (
            <div>Local NavBar</div>
        )
    }
    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}