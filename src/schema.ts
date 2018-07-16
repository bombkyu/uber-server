// schema.ts 파일은 모든 .graphql 파일들을 합친 파일이다.

import {GraphQLSchema} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import {fileLoader, mergeResolvers, mergeTypes} from "merge-graphql-schemas";
import path from 'path';


const allTypes: GraphQLSchema[] = fileLoader(
    // api폴더에 있는 모든 하위폴더들 중에서 .graphql로 끝나는 파일들을 찾는다.
    path.join(__dirname, "./api/**/*.graphql")
);

const allResolvers: string[] = fileLoader(
    path.join(__dirname, "./api/**/*.resolvers.*")
);

const mergedTypes = mergeTypes(allTypes);
const mergedResolvers = mergeResolvers(allResolvers);

const schema = makeExecutableSchema({
    typeDefs:mergedTypes,
    resolvers:mergedResolvers
})

export default schema;