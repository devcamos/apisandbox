export interface ArchitectureLayer {
  name: string
  annotation?: string
  file: string
  responsibility: string
  code: string
}

export interface FrameworkPattern {
  framework: string
  language: string
  icon: string
  layers: ArchitectureLayer[]
  bestPractices: string[]
}

export interface CategoryArchitecture {
  categoryId: string
  patterns: FrameworkPattern[]
}

export const apiArchitecturePatterns: CategoryArchitecture[] = [
  {
    categoryId: "rest",
    patterns: [
      {
        framework: "Spring Boot",
        language: "Java",
        icon: "☕",
        layers: [
          { name: "Controller", annotation: "@RestController", file: "UserController.java", responsibility: "Route HTTP requests, validate input, return ResponseEntity",
            code: `@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        UserResponse created = userService.create(request);
        URI location = URI.create("/api/users/" + created.id());
        return ResponseEntity.created(location).body(created);
    }
}` },
          { name: "DTO", annotation: "@Valid", file: "CreateUserRequest.java", responsibility: "Shape the API contract — decouple wire format from domain model",
            code: `public record CreateUserRequest(
    @NotBlank String name,
    @Email   String email
) {}

// Response DTO
public record UserResponse(
    Long   id,
    String name,
    String email
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(), user.getName(), user.getEmail());
    }
}` },
          { name: "Service", annotation: "@Service", file: "UserService.java", responsibility: "Business logic, orchestrate domain rules, transaction boundaries",
            code: `@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public UserResponse findById(Long id) {
        User user = repo.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", id));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse create(CreateUserRequest req) {
        User user = new User(req.name(), req.email());
        return UserResponse.from(repo.save(user));
    }
}` },
          { name: "Repository", annotation: "@Repository", file: "UserRepository.java", responsibility: "Data access via JPA/Hibernate — translate domain to SQL",
            code: `@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.name LIKE %:q%")
    List<User> search(@Param("q") String query);
}` },
          { name: "Entity", annotation: "@Entity", file: "User.java", responsibility: "Database table mapping — JPA manages lifecycle and persistence",
            code: `@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @CreationTimestamp
    private Instant createdAt;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
}` },
        ],
        bestPractices: [
          "DTOs decouple your API contract from the database schema — never expose @Entity directly",
          "@Transactional(readOnly = true) on the service class, override with @Transactional on writes",
          "Return ResponseEntity with proper status codes (201 Created, 204 No Content)",
          "Use Bean Validation (@Valid, @NotBlank, @Email) at the controller layer",
          "Repository extends JpaRepository for CRUD — add custom queries via method naming",
        ],
      },
      {
        framework: "Express",
        language: "TypeScript",
        icon: "🟢",
        layers: [
          { name: "Router", annotation: "express.Router()", file: "user.routes.ts", responsibility: "Define route paths, attach middleware, delegate to controller",
            code: `import { Router } from "express";
import { validate } from "../middleware/validate";
import { createUserSchema } from "./user.schema";
import * as ctrl from "./user.controller";

const router = Router();
router.get("/:id", ctrl.getUser);
router.post("/", validate(createUserSchema), ctrl.createUser);
router.put("/:id", validate(updateUserSchema), ctrl.updateUser);
router.delete("/:id", ctrl.deleteUser);
export default router;` },
          { name: "Controller", annotation: "RequestHandler", file: "user.controller.ts", responsibility: "Parse req/res, call service, send HTTP response",
            code: `import { RequestHandler } from "express";
import * as userService from "./user.service";

export const getUser: RequestHandler = async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json(user);
};

export const createUser: RequestHandler = async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json(user);
};` },
          { name: "DTO / Schema", annotation: "zod.object()", file: "user.schema.ts", responsibility: "Validate and type request payloads at runtime",
            code: `import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();
export type UpdateUserInput = z.infer<typeof updateUserSchema>;` },
          { name: "Service", annotation: "class", file: "user.service.ts", responsibility: "Business logic, orchestrate data access",
            code: `import { prisma } from "../lib/prisma";
import type { CreateUserInput } from "./user.schema";

export const findById = async (id: string) => {
  return prisma.user.findUniqueOrThrow({ where: { id } });
};

export const create = async (data: CreateUserInput) => {
  return prisma.user.create({ data });
};

export const remove = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};` },
          { name: "Model", annotation: "Prisma model", file: "schema.prisma", responsibility: "Database schema and generated type-safe client",
            code: `model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}` },
        ],
        bestPractices: [
          "Validate with Zod at the router layer — never trust raw req.body",
          "Controllers only handle HTTP concerns (status codes, headers)",
          "Services contain business logic and are framework-agnostic",
          "Use Prisma (or Drizzle) for type-safe database access",
          "Centralise error handling in an Express error middleware",
        ],
      },
      {
        framework: "FastAPI",
        language: "Python",
        icon: "🐍",
        layers: [
          { name: "Router", annotation: "@router.get()", file: "user_router.py", responsibility: "Define endpoints, inject dependencies, return responses",
            code: `from fastapi import APIRouter, Depends, status
from .user_schema import CreateUserRequest, UserResponse
from .user_service import UserService

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    service: UserService = Depends(),
):
    return service.find_by_id(user_id)

@router.post("/", response_model=UserResponse,
             status_code=status.HTTP_201_CREATED)
async def create_user(
    body: CreateUserRequest,
    service: UserService = Depends(),
):
    return service.create(body)` },
          { name: "Schema", annotation: "BaseModel", file: "user_schema.py", responsibility: "Pydantic models validate requests and shape responses",
            code: `from pydantic import BaseModel, EmailStr

class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    model_config = {"from_attributes": True}` },
          { name: "Service", annotation: "class", file: "user_service.py", responsibility: "Business rules, orchestrate repository calls",
            code: `from fastapi import Depends, HTTPException

class UserService:
    def __init__(self, repo: UserRepository = Depends()):
        self.repo = repo

    def find_by_id(self, user_id: int) -> User:
        user = self.repo.get(user_id)
        if not user:
            raise HTTPException(status_code=404)
        return user

    def create(self, data: CreateUserRequest) -> User:
        return self.repo.save(User(**data.model_dump()))` },
          { name: "Repository", annotation: "class", file: "user_repository.py", responsibility: "SQLAlchemy queries — translate domain to SQL",
            code: `from sqlalchemy.orm import Session
from fastapi import Depends

class UserRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def get(self, user_id: int) -> User | None:
        return self.db.query(User).filter(
            User.id == user_id).first()

    def save(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user` },
          { name: "Model", annotation: "Base", file: "user_model.py", responsibility: "SQLAlchemy ORM model mapped to DB table",
            code: `from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    email      = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())` },
        ],
        bestPractices: [
          "Pydantic schemas are your DTOs — separate request and response models",
          "Use Depends() for dependency injection (mirrors Spring @Autowired)",
          "response_model enforces the output contract and strips extra fields",
          "Repository pattern keeps SQLAlchemy out of service logic",
          "Use async def only when doing actual async I/O (e.g. httpx, async DB driver)",
        ],
      },
    ],
  },
  {
    categoryId: "graphql",
    patterns: [
      {
        framework: "Spring Boot",
        language: "Java",
        icon: "☕",
        layers: [
          { name: "Controller", annotation: "@QueryMapping", file: "UserGraphQlController.java", responsibility: "Map GraphQL queries/mutations to Java methods",
            code: `@Controller
@RequiredArgsConstructor
public class UserGraphQlController {

    private final UserService userService;

    @QueryMapping
    public User user(@Argument Long id) {
        return userService.findById(id);
    }

    @MutationMapping
    public User createUser(@Argument CreateUserInput input) {
        return userService.create(input);
    }

    @SchemaMapping(typeName = "User")
    public List<Post> posts(User user) {
        return postService.findByUserId(user.getId());
    }
}` },
          { name: "Input Type", annotation: "record", file: "CreateUserInput.java", responsibility: "Typed input matching the GraphQL schema input type",
            code: `public record CreateUserInput(
    @NotBlank String name,
    @Email   String email
) {}` },
          { name: "Service", annotation: "@Service", file: "UserService.java", responsibility: "Shared business logic (reused from REST if present)",
            code: `@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public User findById(Long id) {
        return repo.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", id));
    }

    @Transactional
    public User create(CreateUserInput input) {
        User user = new User(input.name(), input.email());
        return repo.save(user);
    }
}` },
          { name: "Repository", annotation: "@Repository", file: "UserRepository.java", responsibility: "JPA data access — same as REST layer",
            code: `@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}` },
          { name: "Schema", annotation: ".graphqls", file: "schema.graphqls", responsibility: "SDL defines types, queries, mutations — single source of truth",
            code: `type Query {
    user(id: ID!): User
    users: [User!]!
}

type Mutation {
    createUser(input: CreateUserInput!): User!
}

input CreateUserInput {
    name: String!
    email: String!
}

type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
}` },
        ],
        bestPractices: [
          "Spring for GraphQL uses @QueryMapping / @MutationMapping — not REST annotations",
          "@SchemaMapping resolves nested fields lazily (avoids N+1 with @BatchMapping)",
          "The .graphqls file is the contract — keep it in src/main/resources/graphql/",
          "Reuse the same @Service and @Repository layers from your REST controllers",
          "Use @BatchMapping with DataLoader to batch nested queries efficiently",
        ],
      },
      {
        framework: "Express",
        language: "TypeScript",
        icon: "🟢",
        layers: [
          { name: "Schema", annotation: "typeDefs", file: "schema.graphql", responsibility: "SDL defines the API contract",
            code: `type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}

input CreateUserInput {
  name: String!
  email: String!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}` },
          { name: "Resolver", annotation: "Query / Mutation", file: "user.resolver.ts", responsibility: "Map GraphQL operations to service calls",
            code: `export const resolvers = {
  Query: {
    user: (_, { id }, ctx) =>
      ctx.services.user.findById(id),
    users: (_, __, ctx) =>
      ctx.services.user.findAll(),
  },
  Mutation: {
    createUser: (_, { input }, ctx) =>
      ctx.services.user.create(input),
  },
  User: {
    posts: (parent, _, ctx) =>
      ctx.loaders.postsByUser.load(parent.id),
  },
};` },
          { name: "DataLoader", annotation: "DataLoader", file: "user.loader.ts", responsibility: "Batch and cache nested queries to prevent N+1",
            code: `import DataLoader from "dataloader";
import { prisma } from "../lib/prisma";

export const createPostsByUserLoader = () =>
  new DataLoader<string, Post[]>(async (userIds) => {
    const posts = await prisma.post.findMany({
      where: { userId: { in: [...userIds] } },
    });
    return userIds.map((id) =>
      posts.filter((p) => p.userId === id)
    );
  });` },
          { name: "Service", annotation: "class", file: "user.service.ts", responsibility: "Business logic, reusable across REST and GraphQL",
            code: `import { prisma } from "../lib/prisma";

export class UserService {
  async findById(id: string) {
    return prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async create(input: { name: string; email: string }) {
    return prisma.user.create({ data: input });
  }
}` },
          { name: "Model", annotation: "Prisma model", file: "schema.prisma", responsibility: "Database schema and generated type-safe client",
            code: `model User {
  id    String @id @default(cuid())
  name  String
  email String @unique
  posts Post[]
}

model Post {
  id     String @id @default(cuid())
  title  String
  userId String
  user   User   @relation(fields: [userId], references: [id])
}` },
        ],
        bestPractices: [
          "Use DataLoader to batch nested field resolution and prevent N+1 queries",
          "Resolvers are thin — delegate to service layer for business logic",
          "Pass services and loaders via Apollo context (dependency injection)",
          "codegen (graphql-codegen) generates TypeScript types from the SDL",
          "Keep the .graphql schema file as the single source of truth",
        ],
      },
      {
        framework: "FastAPI",
        language: "Python",
        icon: "🐍",
        layers: [
          { name: "Schema", annotation: "@strawberry.type", file: "types.py", responsibility: "Python classes that define the GraphQL types",
            code: `import strawberry

@strawberry.type
class User:
    id: strawberry.ID
    name: str
    email: str

    @strawberry.field
    async def posts(self, info) -> list["Post"]:
        return await info.context.loaders.posts.load(self.id)

@strawberry.input
class CreateUserInput:
    name: str
    email: str` },
          { name: "Query/Mutation", annotation: "@strawberry.type", file: "resolvers.py", responsibility: "Resolver methods that handle GraphQL operations",
            code: `@strawberry.type
class Query:
    @strawberry.field
    async def user(self, id: strawberry.ID) -> User:
        return await user_service.find_by_id(id)

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_user(self, input: CreateUserInput) -> User:
        return await user_service.create(input)

schema = strawberry.Schema(query=Query, mutation=Mutation)` },
          { name: "DataLoader", annotation: "DataLoader", file: "loaders.py", responsibility: "Batch nested queries to prevent N+1",
            code: `from strawberry.dataloader import DataLoader

async def load_posts_by_user(user_ids: list[int]) -> list[list[Post]]:
    posts = await Post.filter(user_id__in=user_ids)
    by_user = {uid: [] for uid in user_ids}
    for post in posts:
        by_user[post.user_id].append(post)
    return [by_user[uid] for uid in user_ids]

posts_loader = DataLoader(load_fn=load_posts_by_user)` },
          { name: "Service", annotation: "class", file: "user_service.py", responsibility: "Business logic, orchestrate repository calls",
            code: `class UserService:
    def __init__(self, repo: UserRepository = Depends()):
        self.repo = repo

    async def find_by_id(self, user_id: int) -> User:
        user = self.repo.get(user_id)
        if not user:
            raise HTTPException(status_code=404)
        return user

    async def create(self, input: CreateUserInput) -> User:
        return self.repo.save(User(**vars(input)))` },
          { name: "Model", annotation: "Base", file: "user_model.py", responsibility: "SQLAlchemy ORM model",
            code: `from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"
    id    = Column(Integer, primary_key=True)
    name  = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)` },
        ],
        bestPractices: [
          "Strawberry uses Python type hints as the schema — no separate SDL file needed",
          "Use info.context for dependency injection of services and data loaders",
          "DataLoader pattern works the same as Apollo — batch by parent IDs",
          "Mount via GraphQLRouter to get the /graphql endpoint on FastAPI",
          "Use strawberry.lazy for circular type references between User and Post",
        ],
      },
    ],
  },
  {
    categoryId: "grpc",
    patterns: [
      {
        framework: "Spring Boot",
        language: "Java",
        icon: "☕",
        layers: [
          { name: "Proto Definition", annotation: ".proto", file: "user_service.proto", responsibility: "Contract-first schema — generates Java stubs via protoc",
            code: `syntax = "proto3";
option java_package = "com.example.grpc";

service UserService {
  rpc GetUser(GetUserRequest) returns (UserResponse);
  rpc CreateUser(CreateUserRequest) returns (UserResponse);
  rpc ListUsers(Empty) returns (stream UserResponse);
}

message GetUserRequest  { int64 id = 1; }
message CreateUserRequest {
  string name = 1;
  string email = 2;
}
message UserResponse {
  int64  id    = 1;
  string name  = 2;
  string email = 3;
}` },
          { name: "gRPC Service", annotation: "extends ImplBase", file: "UserGrpcService.java", responsibility: "Implements the generated service base class",
            code: `@GrpcService
@RequiredArgsConstructor
public class UserGrpcService
        extends UserServiceGrpc.UserServiceImplBase {

    private final UserService userService;

    @Override
    public void getUser(GetUserRequest req,
            StreamObserver<UserResponse> observer) {
        User user = userService.findById(req.getId());
        observer.onNext(toProto(user));
        observer.onCompleted();
    }

    @Override
    public void listUsers(Empty req,
            StreamObserver<UserResponse> observer) {
        userService.findAll().forEach(u ->
            observer.onNext(toProto(u)));
        observer.onCompleted();
    }
}` },
          { name: "Service", annotation: "@Service", file: "UserService.java", responsibility: "Business logic — shared with REST if needed",
            code: `@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public User findById(Long id) {
        return repo.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("User", id));
    }

    public List<User> findAll() {
        return repo.findAll();
    }
}` },
          { name: "Repository", annotation: "@Repository", file: "UserRepository.java", responsibility: "JPA data access — same as REST",
            code: `@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}` },
          { name: "Config", annotation: "@GrpcService", file: "GrpcServerConfig.java", responsibility: "Spring Boot starter registers the service on a gRPC port",
            code: `// application.yml
grpc:
  server:
    port: 9090

// build.gradle (dependencies)
implementation 'net.devh:grpc-server-spring-boot-starter:3.1.0'
implementation 'io.grpc:grpc-protobuf'
implementation 'io.grpc:grpc-stub'

// protobuf-gradle-plugin generates stubs at build time
protobuf {
    protoc { artifact = "com.google.protobuf:protoc:4.28.2" }
    plugins { grpc { artifact = "io.grpc:protoc-gen-grpc-java:1.68.0" } }
}` },
        ],
        bestPractices: [
          "Proto file is the contract — generate Java stubs with protobuf-maven-plugin",
          "@GrpcService (from grpc-spring-boot-starter) auto-registers on the gRPC port",
          "Reuse the same @Service / @Repository layers from REST — gRPC is just a transport",
          "Use StreamObserver for server-streaming responses",
          "Add grpc-server-spring-boot-starter for auto-configuration (port 9090 by default)",
        ],
      },
      {
        framework: "Express",
        language: "TypeScript",
        icon: "🟢",
        layers: [
          { name: "Proto Definition", annotation: ".proto", file: "user_service.proto", responsibility: "Contract-first schema shared with all clients",
            code: `syntax = "proto3";

package user;

service UserService {
  rpc GetUser (GetUserRequest) returns (UserResponse);
  rpc CreateUser (CreateUserRequest) returns (UserResponse);
  rpc ListUsers (Empty) returns (stream UserResponse);
}

message GetUserRequest  { string id = 1; }
message CreateUserRequest {
  string name  = 1;
  string email = 2;
}
message UserResponse {
  string id    = 1;
  string name  = 2;
  string email = 3;
}` },
          { name: "Server Handler", annotation: "UntypedServiceImplementation", file: "user.handler.ts", responsibility: "Implements the proto service methods",
            code: `import { UserServiceServer } from "./generated/user_service";
import { userService } from "./user.service";

export const userHandlers: UserServiceServer = {
  async getUser(call, callback) {
    const user = await userService.findById(call.request.id);
    callback(null, toProto(user));
  },

  async createUser(call, callback) {
    const user = await userService.create(call.request);
    callback(null, toProto(user));
  },

  listUsers(call) {
    userService.findAll().then((users) => {
      users.forEach((u) => call.write(toProto(u)));
      call.end();
    });
  },
};` },
          { name: "Service", annotation: "class", file: "user.service.ts", responsibility: "Business logic, reusable across transports",
            code: `import { prisma } from "../lib/prisma";

export const userService = {
  findById: (id: string) =>
    prisma.user.findUniqueOrThrow({ where: { id } }),

  findAll: () => prisma.user.findMany(),

  create: (data: { name: string; email: string }) =>
    prisma.user.create({ data }),
};` },
          { name: "Model", annotation: "Prisma model", file: "schema.prisma", responsibility: "Database schema and client",
            code: `model User {
  id    String @id @default(cuid())
  name  String
  email String @unique
}` },
          { name: "Server Bootstrap", annotation: "@grpc/grpc-js", file: "server.ts", responsibility: "Creates and starts the gRPC server",
            code: `import { Server, ServerCredentials } from "@grpc/grpc-js";
import { UserServiceService } from "./generated/user_service";
import { userHandlers } from "./user.handler";

const server = new Server();
server.addService(UserServiceService, userHandlers);
server.bindAsync(
  "0.0.0.0:50051",
  ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    console.log(\`gRPC server on port \${port}\`);
  }
);` },
        ],
        bestPractices: [
          "Use ts-proto or grpc_tools_node_protoc_ts for TypeScript code generation",
          "Handler functions follow the callback pattern — call callback(null, response)",
          "Server streaming uses call.write() + call.end() for each chunk",
          "Separate handler (transport) from service (business logic)",
          "Use @grpc/grpc-js (pure JS) instead of the deprecated native grpc package",
        ],
      },
    ],
  },
  {
    categoryId: "websocket",
    patterns: [
      {
        framework: "Spring Boot",
        language: "Java",
        icon: "☕",
        layers: [
          { name: "Config", annotation: "@EnableWebSocketMessageBroker", file: "WebSocketConfig.java", responsibility: "Enable STOMP over WebSocket, configure broker endpoints",
            code: `@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}` },
          { name: "Controller", annotation: "@MessageMapping", file: "ChatController.java", responsibility: "Handle inbound messages, route to topics",
            code: `@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messaging;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message) {
        messaging.convertAndSend(
            "/topic/room." + message.getRoomId(),
            message);
    }

    @MessageMapping("/chat.join")
    public void joinRoom(JoinRequest req) {
        messaging.convertAndSend(
            "/topic/room." + req.getRoomId(),
            new SystemMessage(req.getUser() + " joined"));
    }
}` },
          { name: "Service", annotation: "@Service", file: "ChatService.java", responsibility: "Business logic — validate, persist, transform messages",
            code: `@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepo;

    public ChatMessage save(ChatMessage msg) {
        msg.setTimestamp(Instant.now());
        return messageRepo.save(msg);
    }

    public List<ChatMessage> getHistory(String roomId, int limit) {
        return messageRepo
            .findByRoomIdOrderByTimestampDesc(roomId,
                PageRequest.of(0, limit));
    }
}` },
          { name: "Interceptor", annotation: "ChannelInterceptor", file: "AuthChannelInterceptor.java", responsibility: "Authenticate WebSocket connections via STOMP headers",
            code: `@Component
@RequiredArgsConstructor
public class AuthChannelInterceptor
        implements ChannelInterceptor {

    private final TokenService tokenService;

    @Override
    public Message<?> preSend(Message<?> message,
            MessageChannel channel) {
        StompHeaderAccessor accessor =
            StompHeaderAccessor.wrap(message);

        if (CONNECT.equals(accessor.getCommand())) {
            String token = accessor
                .getFirstNativeHeader("Authorization");
            var user = tokenService.validate(token);
            accessor.setUser(user);
        }
        return message;
    }
}` },
          { name: "Client", annotation: "SockJS + STOMP", file: "app.js / React", responsibility: "Subscribe to topics and send messages from the browser",
            code: `import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const client = new Client({
  webSocketFactory: () => new SockJS("/ws"),
  onConnect: () => {
    client.subscribe("/topic/room.general", (msg) => {
      const body = JSON.parse(msg.body);
      addMessage(body);
    });
  },
});
client.activate();

// Send a message
client.publish({
  destination: "/app/chat.send",
  body: JSON.stringify({ roomId: "general", text: "Hello!" }),
});` },
        ],
        bestPractices: [
          "Use STOMP over WebSocket — Spring's built-in message broker handles pub/sub",
          "@MessageMapping routes inbound STOMP messages (like @PostMapping for HTTP)",
          "SimpMessagingTemplate sends messages to topics from anywhere in your code",
          "Add a ChannelInterceptor to validate JWT tokens on CONNECT frames",
          "For production, swap the simple broker for RabbitMQ or ActiveMQ (external broker)",
        ],
      },
      {
        framework: "Express",
        language: "TypeScript",
        icon: "🟢",
        layers: [
          { name: "Server Setup", annotation: "Socket.IO", file: "socket.ts", responsibility: "Attach Socket.IO to the Express HTTP server",
            code: `import { Server } from "socket.io";
import { createServer } from "http";
import { app } from "./app";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.use(authMiddleware);
io.on("connection", (socket) =>
  chatHandler(io, socket));

httpServer.listen(3000);` },
          { name: "Handler", annotation: "io.on('connection')", file: "chat.handler.ts", responsibility: "Listen for events, emit responses to rooms",
            code: `import { Server, Socket } from "socket.io";
import { chatService } from "./chat.service";

export function chatHandler(io: Server, socket: Socket) {
  socket.on("chat:join", (roomId: string) => {
    socket.join(roomId);
    io.to(roomId).emit("chat:system",
      \`\${socket.data.user} joined\`);
  });

  socket.on("chat:message", async (data) => {
    const message = await chatService.save(data);
    io.to(data.roomId).emit("chat:message", message);
  });

  socket.on("disconnect", () => { /* cleanup */ });
}` },
          { name: "Middleware", annotation: "io.use()", file: "auth.middleware.ts", responsibility: "Authenticate socket connections via token",
            code: `import { Socket } from "socket.io";
import { verifyToken } from "../lib/jwt";

export function authMiddleware(
  socket: Socket, next: (err?: Error) => void
) {
  const token = socket.handshake.auth.token;
  try {
    const user = verifyToken(token);
    socket.data.user = user.name;
    next();
  } catch {
    next(new Error("Authentication failed"));
  }
}` },
          { name: "Service", annotation: "class", file: "chat.service.ts", responsibility: "Business logic — persist messages, manage rooms",
            code: `import { prisma } from "../lib/prisma";

export const chatService = {
  async save(data: { roomId: string; text: string; user: string }) {
    return prisma.message.create({
      data: {
        roomId: data.roomId,
        text: data.text,
        sender: data.user,
      },
    });
  },

  async getHistory(roomId: string, limit = 50) {
    return prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
};` },
          { name: "Client", annotation: "socket.io-client", file: "useSocket.ts", responsibility: "React hook that connects and listens to events",
            code: `import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(room: string, onMessage: (msg) => void) {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    const socket = io({ auth: { token: getToken() } });
    socket.emit("chat:join", room);
    socket.on("chat:message", onMessage);
    socketRef.current = socket;

    return () => { socket.disconnect(); };
  }, [room]);

  const send = (text: string) =>
    socketRef.current?.emit("chat:message", { roomId: room, text });

  return { send };
}` },
        ],
        bestPractices: [
          "Socket.IO adds rooms, namespaces, and auto-reconnect on top of raw WebSocket",
          "Use io.use() middleware to authenticate sockets before any events fire",
          "Emit to rooms (io.to(room)) instead of broadcasting to all connections",
          "Keep event handlers thin — delegate to a service layer for persistence",
          "For horizontal scaling, use the @socket.io/redis-adapter to share state",
        ],
      },
    ],
  },
  {
    categoryId: "event-driven",
    patterns: [
      {
        framework: "Spring Boot",
        language: "Java",
        icon: "☕",
        layers: [
          { name: "Producer", annotation: "KafkaTemplate", file: "OrderEventProducer.java", responsibility: "Publish domain events to Kafka topics",
            code: `@Component
@RequiredArgsConstructor
public class OrderEventProducer {

    private final KafkaTemplate<String, Object> kafka;

    public void publishOrderPlaced(Order order) {
        var event = new OrderPlacedEvent(
            order.getId(), order.getUserId(),
            order.getTotal(), Instant.now());
        kafka.send("order.placed", order.getId(), event);
    }
}` },
          { name: "Consumer", annotation: "@KafkaListener", file: "OrderEventConsumer.java", responsibility: "Subscribe to topics, receive and route events",
            code: `@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final InventoryService inventoryService;
    private final NotificationService notificationService;

    @KafkaListener(
        topics = "order.placed",
        groupId = "inventory-service")
    public void handleOrderPlaced(OrderPlacedEvent event) {
        inventoryService.reserve(event);
    }

    @KafkaListener(
        topics = "order.placed",
        groupId = "notification-service")
    public void sendConfirmation(OrderPlacedEvent event) {
        notificationService.sendOrderEmail(event);
    }
}` },
          { name: "Event DTO", annotation: "record", file: "OrderPlacedEvent.java", responsibility: "Immutable event payload — serialised to JSON via Jackson",
            code: `public record OrderPlacedEvent(
    String     orderId,
    String     userId,
    BigDecimal amount,
    Instant    timestamp
) {}` },
          { name: "Service", annotation: "@Service", file: "OrderService.java", responsibility: "Business logic triggered by events",
            code: `@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository repo;

    @Transactional
    public void reserve(OrderPlacedEvent event) {
        Inventory item = repo.findByOrderId(event.orderId())
            .orElseGet(() -> new Inventory(event.orderId()));
        item.reserve(event.amount());
        repo.save(item);
    }
}` },
          { name: "Config", annotation: "@EnableKafka", file: "KafkaConfig.java", responsibility: "Serializer, deserializer, consumer group, error handler",
            code: `@EnableKafka
@Configuration
public class KafkaConfig {

    @Bean
    public ConsumerFactory<String, OrderPlacedEvent> consumerFactory() {
        Map<String, Object> props = Map.of(
            BOOTSTRAP_SERVERS_CONFIG, "localhost:9092",
            GROUP_ID_CONFIG, "inventory-service",
            KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class,
            VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class,
            TRUSTED_PACKAGES, "com.example.events"
        );
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderPlacedEvent>
            kafkaListenerContainerFactory() {
        var factory = new ConcurrentKafkaListenerContainerFactory
            <String, OrderPlacedEvent>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}` },
        ],
        bestPractices: [
          "Use record types for events — immutable, serialisable, self-documenting",
          "Key messages by entity ID (orderId) so related events land on the same partition",
          "Different consumer groups process the same event independently (fan-out)",
          "Configure a DefaultErrorHandler with retry + dead-letter topic for poison messages",
          "Make consumers idempotent — Kafka guarantees at-least-once delivery",
        ],
      },
      {
        framework: "Express",
        language: "TypeScript",
        icon: "🟢",
        layers: [
          { name: "Producer", annotation: "KafkaJS", file: "order.producer.ts", responsibility: "Publish events to Kafka topics from any service",
            code: `import { kafka } from "./kafka";
const producer = kafka.producer();

export async function publishOrderPlaced(order: Order) {
  await producer.connect();
  await producer.send({
    topic: "order.placed",
    messages: [{
      key: order.id,
      value: JSON.stringify({
        orderId: order.id,
        userId: order.userId,
        amount: order.total,
        timestamp: new Date().toISOString(),
      }),
    }],
  });
}` },
          { name: "Consumer", annotation: "consumer.run()", file: "order.consumer.ts", responsibility: "Subscribe to topics, dispatch to handlers",
            code: `import { kafka } from "./kafka";
import { inventoryHandler } from "./inventory.handler";

const consumer = kafka.consumer({
  groupId: "inventory-service",
});

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "order.placed" });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value!.toString());
      await inventoryHandler.reserve(event);
    },
  });
}` },
          { name: "Event Type", annotation: "interface", file: "events.ts", responsibility: "TypeScript types for event payloads",
            code: `export interface OrderPlacedEvent {
  orderId: string;
  userId: string;
  amount: number;
  timestamp: string;
}

export interface PaymentProcessedEvent {
  orderId: string;
  status: "success" | "failed";
  transactionId: string;
}` },
          { name: "Handler", annotation: "function", file: "inventory.handler.ts", responsibility: "Process a specific event type",
            code: `import { prisma } from "../lib/prisma";
import type { OrderPlacedEvent } from "./events";

export const inventoryHandler = {
  async reserve(event: OrderPlacedEvent) {
    await prisma.inventory.update({
      where: { orderId: event.orderId },
      data: { status: "reserved", amount: event.amount },
    });
  },
};` },
          { name: "Config", annotation: "Kafka()", file: "kafka.ts", responsibility: "Client, producer, consumer group setup",
            code: `import { Kafka, logLevel } from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 5,
  },
});` },
        ],
        bestPractices: [
          "KafkaJS is the standard Node.js Kafka client — lightweight and Promise-based",
          "Key messages by entity ID so partition ordering is preserved per entity",
          "Use eachMessage for simple handlers, eachBatch for high-throughput consumers",
          "Track offsets manually only if you need exactly-once semantics",
          "Add a dead-letter queue for messages that fail after retries",
        ],
      },
    ],
  },
]

export function getPatternsByCategory(categoryId: string): FrameworkPattern[] {
  return apiArchitecturePatterns.find((c) => c.categoryId === categoryId)?.patterns ?? []
}
