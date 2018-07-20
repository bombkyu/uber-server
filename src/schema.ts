// schema.ts 파일은 모든 .graphql 파일들을 합친 파일이다.

import {GraphQLSchema} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import {fileLoader, mergeResolvers, mergeTypes} from "merge-graphql-schemas";
import path from 'path';

 // api폴더에 있는 모든 하위폴더들 중에서 .graphql로 끝나는 파일들을 찾는다.
const allTypes: GraphQLSchema[] = fileLoader(
    path.join(__dirname, "./api/**/*.graphql")
);

// Find all the resolvers files inside api folder.
const allResolvers: string[] = fileLoader(
    path.join(__dirname, "./api/**/*.resolvers.*")
);

// Merge all the graphqls and merge all the resolvers
const mergedTypes = mergeTypes(allTypes);
const mergedResolvers = mergeResolvers(allResolvers);

// Create Schema that includes graphql and resolvers.
// This is the object that will be used in GraphQLServer.
const schema = makeExecutableSchema({
    typeDefs:mergedTypes,
    resolvers:mergedResolvers
})

export default schema;