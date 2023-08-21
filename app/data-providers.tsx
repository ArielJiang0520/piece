'use client'
import { Fandom, Tag, FandomMediaType, TagCategory, Character, Relationship } from "@/types/types.world";
import { createContext, useState, useContext, useEffect } from "react";
import { fetch_all_fandoms, fetch_all_fandom_media_types, insert_fandom, fetch_all_tags, fetch_all_tags_categories, fetch_all_characters, fetch_all_relationships } from "@/utils/data-helpers";

type DataContext = {
    fandoms: Fandom[];
    tags: Tag[];
    characters: Character[];
    relationships: Relationship[];
    fandomMediaTypes: FandomMediaType[];
    tagsCategories: TagCategory[];
    addFandom: (arg: Fandom) => void;
};

const Context = createContext<DataContext | undefined>(undefined);

export default function DataProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [fandoms, setFandoms] = useState<Fandom[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const [characters, setCharacters] = useState<Character[]>([])
    const [relationships, setRelationships] = useState<Character[]>([])
    const [fandomMediaTypes, setFandomMediaTypes] = useState<FandomMediaType[]>([])
    const [tagsCategories, setTagsCategories] = useState<TagCategory[]>([])

    const fetchFandoms = async () => {
        setFandoms(await fetch_all_fandoms())
    }

    const fetchTags = async () => {
        setTags(await fetch_all_tags())
    }

    const fetchCharacters = async () => {
        setCharacters(await fetch_all_characters())
    }

    const fetchRelationships = async () => {
        setRelationships(await fetch_all_relationships())
    }

    const fetchFandomMediaTypes = async () => {
        setFandomMediaTypes(await fetch_all_fandom_media_types())
    }

    const fetchTagsCategories = async () => {
        setTagsCategories(await fetch_all_tags_categories())
    }

    const addFandom = async (fandom: Fandom) => {
        await insert_fandom(fandom)
        await fetchFandoms()
    }

    useEffect(() => {
        fetchFandoms()
        fetchTags()
        fetchCharacters()
        fetchFandomMediaTypes()
        fetchTagsCategories()
        fetchRelationships()
    }, [])

    return (
        <Context.Provider value={{ fandoms, tags, characters, relationships, fandomMediaTypes, tagsCategories, addFandom }}>
            <>{children}</>
        </Context.Provider>
    );
}

export const useData = () => {
    const context = useContext(Context);

    if (context === undefined) {
        throw new Error('useSupabase must be used inside SupabaseProvider');
    }

    return context;
};