# RareBooksService.WebApi/Dockerfile

# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["RareBooksService.Common/RareBooksService.Common.csproj", "RareBooksService.Common/"]
COPY ["RareBooksService.Data/RareBooksService.Data.csproj", "RareBooksService.Data/"]
COPY ["RareBooksService.WebApi/RareBooksService.WebApi.csproj", "RareBooksService.WebApi/"]
RUN dotnet restore "RareBooksService.WebApi/RareBooksService.WebApi.csproj"
COPY . .
WORKDIR "/src/RareBooksService.WebApi"
RUN dotnet build "RareBooksService.WebApi.csproj" -c Release -o /app/build

# Stage 2: Publish the application
FROM build AS publish
RUN dotnet publish "RareBooksService.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Run the application
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RareBooksService.WebApi.dll"]
